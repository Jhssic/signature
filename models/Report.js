import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Título é obrigatório"],
    trim: true,
    maxlength: [200, "Título deve ter no máximo 200 caracteres"],
  },
  description: {
    type: String,
    required: [true, "Descrição é obrigatória"],
    maxlength: [1000, "Descrição deve ter no máximo 1000 caracteres"],
  },
  content: {
    type: String,
    required: [true, "Conteúdo é obrigatório"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    required: [true, "Departamento é obrigatório"],
  },
  type: {
    type: String,
    enum: ["Mensal", "Trimestral", "Anual", "Especial"],
    required: [true, "Tipo é obrigatório"],
  },
  status: {
    type: String,
    enum: ["Rascunho", "Pendente", "Em Revisão", "Assinado", "Rejeitado"],
    default: "Rascunho",
  },
  priority: {
    type: String,
    enum: ["Baixa", "Média", "Alta", "Urgente"],
    default: "Média",
  },
  fileName: String,
  fileSize: Number,
  filePath: String,
  mimeType: String,
  tags: [String],
  dueDate: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedAt: Date,
  reviewComments: String,
  signatures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signature",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Índices para melhor performance
reportSchema.index({ author: 1, createdAt: -1 })
reportSchema.index({ department: 1, status: 1 })
reportSchema.index({ type: 1, createdAt: -1 })

// Atualizar updatedAt antes de salvar
reportSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model("Report", reportSchema)
