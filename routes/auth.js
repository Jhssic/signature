import express from "express"
import jwt from "jsonwebtoken"
import rateLimit from "express-rate-limit"
import User from "../models/User.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: "Muitas tentativas de login, tente novamente em 15 minutos",
  skipSuccessfulRequests: true,
})

// Registrar usuário
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, position, phone, location } = req.body

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso" })
    }

    // Criar novo usuário
    const user = new User({
      name,
      email,
      password,
      department,
      position,
      phone,
      location,
    })

    await user.save()

    // Gerar token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" })
    }

    // Buscar usuário
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // Verificar senha
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // Verificar se usuário está ativo
    if (user.status !== "Ativo") {
      return res.status(401).json({ message: "Usuário inativo" })
    }

    // Atualizar último login
    user.lastLogin = new Date()
    await user.save()

    // Gerar token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Verificar token
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    message: "Token válido",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department,
      position: req.user.position,
    },
  })
})

// Logout (invalidar token no frontend)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logout realizado com sucesso" })
})

export default router
