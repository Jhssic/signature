import express from "express"
import User from "../models/User.js"
import { authorize } from "../middleware/auth.js"

const router = express.Router()

// Listar funcionários
router.get("/", authorize("admin", "manager"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query

    // Construir filtros
    const filters = {}
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ]
    }
    if (department) filters.department = department
    if (status) filters.status = status

    // Buscar funcionários
    const employees = await User.find(filters)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(filters)

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Buscar funcionário por ID
router.get("/:id", authorize("admin", "manager"), async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password")
    if (!employee) {
      return res.status(404).json({ message: "Funcionário não encontrado" })
    }
    res.json(employee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Criar funcionário
router.post("/", authorize("admin", "manager"), async (req, res) => {
  try {
    const employee = new User(req.body)
    await employee.save()

    const employeeResponse = employee.toObject()
    delete employeeResponse.password

    res.status(201).json({
      message: "Funcionário criado com sucesso",
      employee: employeeResponse,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Atualizar funcionário
router.put("/:id", authorize("admin", "manager"), async (req, res) => {
  try {
    const { password, ...updateData } = req.body

    const employee = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!employee) {
      return res.status(404).json({ message: "Funcionário não encontrado" })
    }

    res.json({
      message: "Funcionário atualizado com sucesso",
      employee,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Deletar funcionário
router.delete("/:id", authorize("admin"), async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: "Funcionário não encontrado" })
    }
    res.json({ message: "Funcionário removido com sucesso" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Estatísticas de funcionários
router.get("/stats/overview", authorize("admin", "manager"), async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "Ativo"] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ["$status", "Inativo"] }, 1, 0] } },
        },
      },
    ])

    const departmentStats = await User.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      overview: stats[0] || { total: 0, active: 0, inactive: 0 },
      byDepartment: departmentStats,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
