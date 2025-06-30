"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, CheckCircle, XCircle, Clock, FileText, Calendar, User, Key, AlertTriangle } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function SignaturesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const signatures = [
    {
      id: 1,
      documentTitle: "Relatório Mensal - Janeiro 2024",
      signer: "João Silva",
      signerEmail: "joao.silva@empresa.com",
      signedAt: "2024-01-15T10:30:00",
      status: "Válida",
      algorithm: "RSA-2048",
      certificateIssuer: "ICP-Brasil",
      validUntil: "2025-01-15",
    },
    {
      id: 2,
      documentTitle: "Análise de Desempenho Q1",
      signer: "Maria Santos",
      signerEmail: "maria.santos@empresa.com",
      signedAt: "2024-01-14T14:20:00",
      status: "Pendente",
      algorithm: "RSA-2048",
      certificateIssuer: "ICP-Brasil",
      validUntil: "2025-01-14",
    },
    {
      id: 3,
      documentTitle: "Relatório de Vendas - Dezembro",
      signer: "Pedro Costa",
      signerEmail: "pedro.costa@empresa.com",
      signedAt: "2024-01-13T16:45:00",
      status: "Expirada",
      algorithm: "RSA-2048",
      certificateIssuer: "ICP-Brasil",
      validUntil: "2024-01-13",
    },
    {
      id: 4,
      documentTitle: "Auditoria de Segurança",
      signer: "Ana Oliveira",
      signerEmail: "ana.oliveira@empresa.com",
      signedAt: "2024-01-12T09:15:00",
      status: "Válida",
      algorithm: "RSA-2048",
      certificateIssuer: "ICP-Brasil",
      validUntil: "2025-01-12",
    },
  ]

  const filteredSignatures = signatures.filter(
    (signature) =>
      signature.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signature.signer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signature.signerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Válida":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "Pendente":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "Expirada":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Válida":
        return "default"
      case "Pendente":
        return "secondary"
      case "Expirada":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assinaturas Digitais</h1>
              <p className="text-gray-600 mt-2">Gerencie e verifique assinaturas digitais</p>
            </div>
            <Button>
              <Shield className="h-4 w-4 mr-2" />
              Verificar Assinatura
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assinaturas Válidas</p>
                  <p className="text-2xl font-bold text-green-600">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiradas</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar assinaturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Signatures List */}
        <div className="space-y-4">
          {filteredSignatures.map((signature) => (
            <Card key={signature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(signature.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{signature.documentTitle}</h3>
                      <Badge variant={getStatusColor(signature.status)}>{signature.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            <strong>Assinante:</strong> {signature.signer}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            <strong>Data:</strong> {new Date(signature.signedAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <span>
                            <strong>Algoritmo:</strong> {signature.algorithm}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <strong>E-mail:</strong> {signature.signerEmail}
                        </div>
                        <div>
                          <strong>Emissor:</strong> {signature.certificateIssuer}
                        </div>
                        <div>
                          <strong>Válido até:</strong> {new Date(signature.validUntil).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      Verificar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSignatures.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma assinatura encontrada.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
