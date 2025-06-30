import express from "express"
import Report from "../models/Report.js"
import { uploadReport } from "../middleware/upload.js"
import fs from "fs"

const router = express.Router()

// Listar relatórios
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status, type } = req.query

    // Construir filtros
    const filters = {}
    if (search) {
      filters.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }
    if (department) filters.department = department
    if (status) filters.status = status
    if (type) filters.type = type

    // Se não for admin/manager, mostrar apenas próprios relatórios
    if (!["admin", "manager"].includes(req.user.role)) {
      filters.author = req.user._id
    }

    // Buscar relatórios
    const reports = await Report.find(filters)
      .populate("author", "name email department")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Report.countDocuments(filters)

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Buscar relatório por ID
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("author", "name email department position")
      .populate("reviewedBy", "name email")
      .populate("signatures")

    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado" })
    }

    // Verificar permissão
    if (!["admin", "manager"].includes(req.user.role) && report.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    res.json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Criar relatório
router.post("/", uploadReport.single("file"), async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      author: req.user._id,
      department: req.user.department,
    }

    // Se arquivo foi enviado
    if (req.file) {
      reportData.fileName = req.file.originalname
      reportData.fileSize = req.file.size
      reportData.filePath = req.file.path
      reportData.mimeType = req.file.mimetype
    }

    const report = new Report(reportData)
    await report.save()

    const populatedReport = await Report.findById(report._id).populate("author", "name email department")

    res.status(201).json({
      message: "Relatório criado com sucesso",
      report: populatedReport,
    })
  } catch (error) {
    // Remover arquivo se erro ocorreu
    if (req.file) {
      fs.unlink(req.file.path, () => {})
    }
    res.status(400).json({ message: error.message })
  }
})

// Atualizar relatório
router.put("/:id", uploadReport.single("file"), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado" })
    }

    // Verificar permissão
    if (!["admin", "manager"].includes(req.user.role) && report.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    // Não permitir edição se já assinado
    if (report.status === "Assinado") {
      return res.status(400).json({ message: "Não é possível editar relatório assinado" })
    }

    const updateData = { ...req.body }

    // Se novo arquivo foi enviado
    if (req.file) {
      // Remover arquivo antigo
      if (report.filePath && fs.existsSync(report.filePath)) {
        fs.unlink(report.filePath, () => {})
      }

      updateData.fileName = req.file.originalname
      updateData.fileSize = req.file.size
      updateData.filePath = req.file.path
      updateData.mimeType = req.file.mimetype
    }

    const updatedReport = await Report.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "name email department")

    res.json({
      message: "Relatório atualizado com sucesso",
      report: updatedReport,
    })
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {})
    }
    res.status(400).json({ message: error.message })
  }
})

// Deletar relatório
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado" })
    }

    // Verificar permissão
    if (!["admin", "manager"].includes(req.user.role) && report.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    // Não permitir exclusão se já assinado
    if (report.status === "Assinado") {
      return res.status(400).json({ message: "Não é possível excluir relatório assinado" })
    }

    // Remover arquivo
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlink(report.filePath, () => {})
    }

    await Report.findByIdAndDelete(req.params.id)
    res.json({ message: "Relatório removido com sucesso" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Download de arquivo
router.get("/:id/download", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: "Relatório não encontrado" })
    }

    // Verificar permissão
    if (!["admin", "manager"].includes(req.user.role) && report.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    if (!report.filePath || !fs.existsSync(report.filePath)) {
      return res.status(404).json({ message: "Arquivo não encontrado" })
    }

    res.download(report.filePath, report.fileName)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Estatísticas de relatórios
router.get("/stats/overview", async (req, res) => {
  try {
    const filters = {}
    if (!["admin", "manager"].includes(req.user.role)) {
      filters.author = req.user._id
    }

    const stats = await Report.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pendente"] }, 1, 0] } },
          signed: { $sum: { $cond: [{ $eq: ["$status", "Assinado"] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ["$status", "Rascunho"] }, 1, 0] } },
        },
      },
    ])

    const byType = await Report.aggregate([
      { $match: filters },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      overview: stats[0] || { total: 0, pending: 0, signed: 0, draft: 0 },
      byType,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
