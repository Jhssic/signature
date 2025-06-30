"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ViewReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Visualizar Relatório</CardTitle>
            <Button asChild variant="outline">
              <Link href={`/reports/${params.id}/edit`}>Editar</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {/* TODO: carregar e exibir dados do relatório */}
            <p className="text-gray-600">Em construção...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
