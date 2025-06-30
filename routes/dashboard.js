import express from "express"
import User from "../models/User.js"
import Report from "../models/Report.js"
import Signature from "../models/Signature.js"

const router = express.Router()

// Estatísticas gerais do dashboard
router.get("/stats", async (req, res) => {
  try {
    const isAdminOrManager = ["admin", "manager"].includes(req.user.role)

    // Filtros baseados no papel do usuário
    const userFilter = isAdminOrManager ? {} : { author: req.user._id }
    const signatureFilter = isAdminOrManager ? {} : { signer: req.user._id }

    // Estatísticas de funcionários (apenas admin/manager)
    let employeeStats = { total: 0, active: 0, inactive: 0 }
    if (isAdminOrManager) {
      const empStats = await User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$status", "Ativo"] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ["$status", "Inativo"] }, 1, 0] } },
          },
        },
      ])
      employeeStats = empStats[0] || employeeStats
    }

    // Estatísticas de relatórios
    const reportStats = await Report.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pendente"] }, 1, 0] } },
          signed: { $sum: { $cond: [{ $eq: ["$status", "Assinado"] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ["$status", "Rascunho"] }, 1, 0] } },
          review: { $sum: { $cond: [{ $eq: ["$status", "Em Revisão"] }, 1, 0] } },
        },
      },
    ])

    // Estatísticas de assinaturas
    const signatureStats = await Signature.aggregate([
      { $match: signatureFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          valid: { $sum: { $cond: [{ $eq: ["$status", "Válida"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pendente"] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ["$status", "Expirada"] }, 1, 0] } },
        },
      },
    ])

    res.json({
      employees: employeeStats,
      reports: reportStats[0] || { total: 0, pending: 0, signed: 0, draft: 0, review: 0 },
      signatures: signatureStats[0] || { total: 0, valid: 0, pending: 0, expired: 0 },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Relatórios recentes
router.get("/recent-reports", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 5
    const userFilter = ["admin", "manager"].includes(req.user.role) ? {} : { author: req.user._id }

    const reports = await Report.find(userFilter)
      .populate("author", "name email department")
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title description status type createdAt author")

    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Assinaturas recentes
router.get("/recent-signatures", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 5
    const userFilter = ["admin", "manager"].includes(req.user.role) ? {} : { signer: req.user._id }

    const signatures = await Signature.find(userFilter)
      .populate("document", "title type")
      .populate("signer", "name email")
      .sort({ signedAt: -1 })
      .limit(limit)
      .select("document signer status signedAt algorithm")

    res.json(signatures)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Atividades do usuário
router.get("/user-activity", async (req, res) => {
  try {
    const userId = req.user._id
    const days = Number.parseInt(req.query.days) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Relatórios criados
    const reportsCreated = await Report.countDocuments({
      author: userId,
      createdAt: { $gte: startDate },
    })

    // Assinaturas realizadas
    const signaturesCreated = await Signature.countDocuments({
      signer: userId,
      signedAt: { $gte: startDate },
    })

    // Último login
    const user = await User.findById(userId).select("lastLogin")

    res.json({
      period: `${days} dias`,
      reportsCreated,
      signaturesCreated,
      lastLogin: user.lastLogin,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Alertas de segurança
router.get("/security-alerts", async (req, res) => {
  try {
    const alerts = []

    // Assinaturas expirando em 30 dias
    const expiringSignatures = await Signature.countDocuments({
      status: "Válida",
      validUntil: {
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        $gte: new Date(),
      },
    })

    if (expiringSignatures > 0) {
      alerts.push({
        type: "warning",
        message: `${expiringSignatures} assinatura(s) expirando em 30 dias`,
        count: expiringSignatures,
      })
    }

    // Assinaturas inválidas
    const invalidSignatures = await Signature.countDocuments({
      status: "Inválida",
    })

    if (invalidSignatures > 0) {
      alerts.push({
        type: "error",
        message: `${invalidSignatures} assinatura(s) inválida(s) detectada(s)`,
        count: invalidSignatures,
      })
    }

    // Relatórios pendentes há mais de 7 dias
    const oldPendingReports = await Report.countDocuments({
      status: "Pendente",
      createdAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })

    if (oldPendingReports > 0) {
      alerts.push({
        type: "info",
        message: `${oldPendingReports} relatório(s) pendente(s) há mais de 7 dias`,
        count: oldPendingReports,
      })
    }

    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
