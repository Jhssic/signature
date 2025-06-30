"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Shield, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total de Funcionários",
      value: "24",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Relatórios Pendentes",
      value: "8",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Assinaturas Validadas",
      value: "156",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Alertas de Segurança",
      value: "2",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  const recentReports = [
    {
      id: 1,
      title: "Relatório Mensal - Janeiro",
      employee: "João Silva",
      status: "Assinado",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Análise de Desempenho Q1",
      employee: "Maria Santos",
      status: "Pendente",
      date: "2024-01-14",
    },
    {
      id: 3,
      title: "Relatório de Vendas",
      employee: "Pedro Costa",
      status: "Em Revisão",
      date: "2024-01-13",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema de assinatura digital</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Relatórios Recentes</CardTitle>
                  <CardDescription>Últimos relatórios submetidos</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/reports">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Relatório
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-600">{report.employee}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <Badge
                      variant={
                        report.status === "Assinado"
                          ? "default"
                          : report.status === "Pendente"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/employees">
                    <Users className="h-6 w-6 mb-2" />
                    Funcionários
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/reports">
                    <FileText className="h-6 w-6 mb-2" />
                    Relatórios
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/signatures">
                    <Shield className="h-6 w-6 mb-2" />
                    Assinaturas
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/analytics">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Análises
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
