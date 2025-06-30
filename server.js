import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from "morgan"

// Importar rotas
import authRoutes from "./routes/auth.js"
import employeeRoutes from "./routes/employees.js"
import reportRoutes from "./routes/reports.js"
import signatureRoutes from "./routes/signatures.js"
import dashboardRoutes from "./routes/dashboard.js"

// Importar middlewares
import { errorHandler } from "./middleware/errorHandler.js"
import { authenticateToken } from "./middleware/auth.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: "Muitas tentativas, tente novamente em 15 minutos",
})

// Middlewares de segurança
app.use(helmet())
app.use(limiter)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Middlewares gerais
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/digital-signature", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err))

// Rotas públicas
app.use("/api/auth", authRoutes)

// Rotas protegidas
app.use("/api/employees", authenticateToken, employeeRoutes)
app.use("/api/reports", authenticateToken, reportRoutes)
app.use("/api/signatures", authenticateToken, signatureRoutes)
app.use("/api/dashboard", authenticateToken, dashboardRoutes)

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando",
    timestamp: new Date().toISOString(),
  })
})

// Middleware de tratamento de erros
app.use(errorHandler)

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})

export default app
