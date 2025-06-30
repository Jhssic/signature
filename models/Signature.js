import mongoose from "mongoose"

const signatureSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    required: true,
  },
  signer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  signatureHash: {
    type: String,
    required: [true, "Hash da assinatura é obrigatório"],
  },
  algorithm: {
    type: String,
    enum: ["RSA-2048", "RSA-4096", "ECDSA-P256", "ECDSA-P384"],
    default: "RSA-2048",
  },
  certificateIssuer: {
    type: String,
    default: "ICP-Brasil",
  },
  certificateSerial: String,
  publicKey: {
    type: String,
    required: [true, "Chave pública é obrigatória"],
  },
  privateKeyHash: String,
  status: {
    type: String,
    enum: ["Válida", "Pendente", "Expirada", "Revogada", "Inválida"],
    default: "Pendente",
  },
  signedAt: {
    type: Date,
    default: Date.now,
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
    required: [true, "Data de validade é obrigatória"],
  },
  ipAddress: String,
  userAgent: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  verificationAttempts: [
    {
      verifiedAt: Date,
      result: Boolean,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  metadata: {
    documentHash: String,
    timestamp: String,
    nonce: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Índices para melhor performance
signatureSchema.index({ document: 1, signer: 1 })
signatureSchema.index({ status: 1, validUntil: 1 })
signatureSchema.index({ signedAt: -1 })

export default mongoose.model("Signature", signatureSchema)
