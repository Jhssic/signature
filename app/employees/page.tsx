"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Edit, Mail, Phone, MapPin } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const employees = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@empresa.com",
      phone: "(11) 99999-9999",
      department: "Vendas",
      position: "Gerente de Vendas",
      status: "Ativo",
      location: "São Paulo, SP",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
      phone: "(11) 88888-8888",
      department: "Marketing",
      position: "Analista de Marketing",
      status: "Ativo",
      location: "Rio de Janeiro, RJ",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro.costa@empresa.com",
      phone: "(11) 77777-7777",
      department: "TI",
      position: "Desenvolvedor",
      status: "Inativo",
      location: "Belo Horizonte, MG",
    },
  ]

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
              <p className="text-gray-600 mt-2">Gerencie os funcionários da empresa</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
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
                  placeholder="Buscar funcionários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>{employee.position}</CardDescription>
                  </div>
                  <Badge variant={employee.status === "Ativo" ? "default" : "secondary"}>{employee.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {employee.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {employee.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {employee.location}
                  </div>
                  <div className="pt-3 border-t">
                    <Badge variant="outline">{employee.department}</Badge>
                  </div>
                  <div className="flex justify-end space-x-2 pt-3">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Nenhum funcionário encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
