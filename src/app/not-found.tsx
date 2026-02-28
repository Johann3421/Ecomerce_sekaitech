import Link from "next/link"
import Button from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-brand-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-ink-primary mb-2">
          Página no encontrada
        </h1>
        <p className="text-ink-secondary mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button size="lg">Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  )
}
