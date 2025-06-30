"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Eye, FileText, Calendar, User, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const reports = [
    {
      id: 1,
      title: "Relatório Mensal - Janeiro 2024",
      description: "Análise completa das atividades do mês de janeiro",
      author: "João Silva",
      department: "Vendas",
      createdAt: "2024-01-15",
      status: "Assinado",
      type: "Mensal",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Análise de Desempenho Q1",
      description: "Relatório trimestral de desempenho da equipe",
      author: "Maria Santos",
      department: "RH",
      createdAt: "2024-01-14",
      status: "Pendente",
      type: "Trimestral",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Relatório de Vendas - Dezembro",
      description: "Consolidado de vendas do último mês do ano",
      author: "Pedro Costa",
      department: "Vendas",
      createdAt: "2024-01-13",
      status: "Em Revisão",
      type: "Mensal",
      size: "3.1 MB",
    },
    {
      id: 4,
      title: "Auditoria de Segurança",
      description: "Relatório de auditoria de segurança da informação",
      author: "Ana Oliveira",
      department: "TI",
      createdAt: "2024-01-12",
      status: "Assinado",
      type: "Especial",
      size: "5.2 MB",
    },
  ]

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Assinado":
        return "default"
      case "Pendente":
        return "secondary"
      case "Em Revisão":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="text-gray-600 mt-2">Gerencie todos os relatórios da empresa</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Relatório
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {report.author} • {report.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum relatório encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
