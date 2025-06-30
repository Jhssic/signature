"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface VerifyResponse {
  valid: boolean
  message: string
  signature?: {
    document?: { title?: string }
    signer?: { name?: string }
    signedAt: string
    algorithm: string
  }
}

export default function VerifySignaturePage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerifyResponse | null>(null)

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/signatures/verify/${id}`, {
          method: "POST",
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Erro ao verificar")
        setResult(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [id])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verificando assinatura...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )
    }

    if (result) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {result.valid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={result.valid ? "text-green-600" : "text-red-600"}>
              {result.message}
            </span>
          </div>
          {result.signature && (
            <div className="text-sm text-gray-600 space-y-1">
              {result.signature.document?.title && (
                <p>
                  <strong>Documento:</strong> {result.signature.document.title}
                </p>
              )}
              {result.signature.signer?.name && (
                <p>
                  <strong>Assinante:</strong> {result.signature.signer.name}
                </p>
              )}
              <p>
                <strong>Data:</strong>{" "}
                {new Date(result.signature.signedAt).toLocaleString("pt-BR")}
              </p>
              <p>
                <strong>Algoritmo:</strong> {result.signature.algorithm}
              </p>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Verificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderContent()}
            <Button asChild variant="outline" className="mt-4">
              <Link href="/signatures">Voltar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

