"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VerifySignaturePage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implementar verificação de assinatura
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="file" required />
              <Button type="submit">Verificar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
