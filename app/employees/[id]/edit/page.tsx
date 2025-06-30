"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implementar atualização de funcionário
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Editar Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Nome" defaultValue="" />
              <Input type="email" placeholder="E-mail" defaultValue="" />
              <Button type="submit">Salvar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
