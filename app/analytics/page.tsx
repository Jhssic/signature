"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Análises</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: gráficos e métricas */}
            <p className="text-gray-600">Em construção...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
