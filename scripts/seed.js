import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Report from "../models/Report.js"
import Signature from "../models/Signature.js"

dotenv.config()

const seedData = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/digital-signature")
    console.log("✅ Conectado ao MongoDB")

    // Limpar dados existentes
    await User.deleteMany({})
    await Report.deleteMany({})
    await Signature.deleteMany({})
    console.log("🗑️ Dados existentes removidos")

    // Criar usuários
    const users = await User.create([
      {
        name: "Administrador",
        email: "admin@empresa.com",
        password: "123456",
        role: "admin",
        department: "TI",
        position: "Administrador do Sistema",
        phone: "(11) 99999-9999",
        location: "São Paulo, SP",
      },
      {
        name: "João Silva",
        email: "joao.silva@empresa.com",
        password: "123456",
        role: "manager",
        department: "Vendas",
        position: "Gerente de Vendas",
        phone: "(11) 88888-8888",
        location: "São Paulo, SP",
      },
      {
        name: "Maria Santos",
        email: "maria.santos@empresa.com",
        password: "123456",
        role: "employee",
        department: "Marketing",
        position: "Analista de Marketing",
        phone: "(21) 77777-7777",
        location: "Rio de Janeiro, RJ",
      },
      {
        name: "Pedro Costa",
        email: "pedro.costa@empresa.com",
        password: "123456",
        role: "employee",
        department: "TI",
        position: "Desenvolvedor",
        phone: "(31) 66666-6666",
        location: "Belo Horizonte, MG",
      },
    ])

    console.log("👥 Usuários criados:", users.length)

    // Criar relatórios
    const reports = await Report.create([
      {
        title: "Relatório Mensal - Janeiro 2024",
        description: "Análise completa das atividades do mês de janeiro",
        content: "Conteúdo detalhado do relatório mensal...",
        author: users[1]._id,
        department: "Vendas",
        type: "Mensal",
        status: "Assinado",
      },
      {
        title: "Análise de Desempenho Q1",
        description: "Relatório trimestral de desempenho da equipe",
        content: "Análise detalhada do primeiro trimestre...",
        author: users[2]._id,
        department: "Marketing",
        type: "Trimestral",
        status: "Pendente",
      },
      {
        title: "Relatório de Segurança",
        description: "Auditoria de segurança da informação",
        content: "Relatório completo de segurança...",
        author: users[3]._id,
        department: "TI",
        type: "Especial",
        status: "Em Revisão",
      },
    ])

    console.log("📄 Relatórios criados:", reports.length)

    console.log("✅ Dados de exemplo criados com sucesso!")
    console.log("\n📋 Usuários de teste:")
    console.log("Admin: admin@empresa.com / 123456")
    console.log("Manager: joao.silva@empresa.com / 123456")
    console.log("Employee: maria.santos@empresa.com / 123456")
    console.log("Employee: pedro.costa@empresa.com / 123456")
  } catch (error) {
    console.error("❌ Erro ao criar dados:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Desconectado do MongoDB")
    process.exit(0)
  }
}

seedData()
