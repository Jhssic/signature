"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implementar salvamento de configurações
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Nome da empresa" />
              <Button type="submit">Salvar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
