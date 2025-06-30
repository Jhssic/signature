import express from "express"
import crypto from "crypto"
import Signature from "../models/Signature.js"
import Report from "../models/Report.js"

const router = express.Router()

// Listar assinaturas
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, document } = req.query

    const filters = {}
    if (status) filters.status = status
    if (document) filters.document = document

    // Se não for admin/manager, mostrar apenas próprias assinaturas
    if (!["admin", "manager"].includes(req.user.role)) {
      filters.signer = req.user._id
    }

    const signatures = await Signature.find(filters)
      .populate("document", "title type department")
      .populate("signer", "name email department")
      .sort({ signedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Signature.countDocuments(filters)

    res.json({
      signatures,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Buscar assinatura por ID
router.get("/:id", async (req, res) => {
  try {
    const signature = await Signature.findById(req.params.id)
      .populate("document", "title description type department author")
      .populate("signer", "name email department position")

    if (!signature) {
      return res.status(404).json({ message: "Assinatura não encontrada" })
    }

    // Verificar permissão
    if (!["admin", "manager"].includes(req.user.role) && signature.signer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    res.json(signature)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Criar assinatura digital
router.post("/", async (req, res) => {
  try {
    const { documentId, algorithm = "RSA-2048" } = req.body

    // Verificar se documento existe
    const document = await Report.findById(documentId)
    if (!document) {
      return res.status(404).json({ message: "Documento não encontrado" })
    }

    // Verificar se usuário pode assinar este documento
    if (!["admin", "manager"].includes(req.user.role) && document.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Você não pode assinar este documento" })
    }

    // Verificar se já existe assinatura para este documento e usuário
    const existingSignature = await Signature.findOne({
      document: documentId,
      signer: req.user._id,
    })

    if (existingSignature) {
      return res.status(400).json({ message: "Documento já foi assinado por você" })
    }

    // Gerar par de chaves RSA
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: algorithm === "RSA-4096" ? 4096 : 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    })

    // Criar hash do documento
    const documentContent = `${document.title}${document.description}${document.content}`
    const documentHash = crypto.createHash("sha256").update(documentContent).digest("hex")

    // Criar assinatura digital
    const sign = crypto.createSign("SHA256")
    sign.update(documentHash)
    const signatureHash = sign.sign(privateKey, "hex")

    // Hash da chave privada para armazenamento seguro
    const privateKeyHash = crypto.createHash("sha256").update(privateKey).digest("hex")

    // Criar registro de assinatura
    const signature = new Signature({
      document: documentId,
      signer: req.user._id,
      signatureHash,
      algorithm,
      publicKey,
      privateKeyHash,
      status: "Válida",
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      metadata: {
        documentHash,
        timestamp: new Date().toISOString(),
        nonce: crypto.randomBytes(16).toString("hex"),
      },
    })

    await signature.save()

    // Atualizar status do documento
    document.status = "Assinado"
    document.signatures.push(signature._id)
    await document.save()

    const populatedSignature = await Signature.findById(signature._id)
      .populate("document", "title type")
      .populate("signer", "name email")

    res.status(201).json({
      message: "Documento assinado com sucesso",
      signature: populatedSignature,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Verificar assinatura
router.post("/verify/:id", async (req, res) => {
  try {
    const signature = await Signature.findById(req.params.id).populate("document").populate("signer", "name email")

    if (!signature) {
      return res.status(404).json({ message: "Assinatura não encontrada" })
    }

    // Verificar se assinatura não expirou
    if (new Date() > signature.validUntil) {
      signature.status = "Expirada"
      await signature.save()
      return res.json({
        valid: false,
        message: "Assinatura expirada",
        signature,
      })
    }

    // Recriar hash do documento
    const document = signature.document
    const documentContent = `${document.title}${document.description}${document.content}`
    const documentHash = crypto.createHash("sha256").update(documentContent).digest("hex")

    // Verificar assinatura
    const verify = crypto.createVerify("SHA256")
    verify.update(documentHash)
    const isValid = verify.verify(signature.publicKey, signature.signatureHash, "hex")

    // Registrar tentativa de verificação
    signature.verificationAttempts.push({
      verifiedAt: new Date(),
      result: isValid,
      verifiedBy: req.user._id,
    })

    if (!isValid) {
      signature.status = "Inválida"
    }

    await signature.save()

    res.json({
      valid: isValid,
      message: isValid ? "Assinatura válida" : "Assinatura inválida",
      signature,
      verificationDetails: {
        documentHash,
        algorithm: signature.algorithm,
        signedAt: signature.signedAt,
        validUntil: signature.validUntil,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Estatísticas de assinaturas
router.get("/stats/overview", async (req, res) => {
  try {
    const filters = {}
    if (!["admin", "manager"].includes(req.user.role)) {
      filters.signer = req.user._id
    }

    const stats = await Signature.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          valid: { $sum: { $cond: [{ $eq: ["$status", "Válida"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pendente"] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ["$status", "Expirada"] }, 1, 0] } },
          invalid: { $sum: { $cond: [{ $eq: ["$status", "Inválida"] }, 1, 0] } },
        },
      },
    ])

    const byAlgorithm = await Signature.aggregate([
      { $match: filters },
      { $group: { _id: "$algorithm", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      overview: stats[0] || { total: 0, valid: 0, pending: 0, expired: 0, invalid: 0 },
      byAlgorithm,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
