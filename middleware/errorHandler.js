export const errorHandler = (err, req, res, next) => {
  console.error("❌ Erro:", err)

  // Erro de validação do Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      message: "Erro de validação",
      errors,
    })
  }

  // Erro de duplicação (email já existe)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      message: `${field} já está em uso`,
    })
  }

  // Erro de cast (ID inválido)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "ID inválido",
    })
  }

  // Erro padrão
  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
