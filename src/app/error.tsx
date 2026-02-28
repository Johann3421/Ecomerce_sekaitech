"use client"

import Button from "@/components/ui/Button"
import { RefreshCw } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-red-500 mb-4">Error</p>
        <h1 className="text-2xl font-bold text-ink-primary mb-2">
          Algo salió mal
        </h1>
        <p className="text-ink-secondary mb-8 max-w-md">
          Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
        </p>
        <Button onClick={reset} size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    </div>
  )
}
