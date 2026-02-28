import Link from "next/link"
import { Metadata } from "next"
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react"
import Button from "@/components/ui/Button"

export const metadata: Metadata = { title: "Pedido Confirmado" }

export default function CheckoutSuccessPage() {
  const orderNumber = `LS-${Date.now().toString(36).toUpperCase()}`

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </div>

      <h1 className="text-3xl font-bold text-ink-primary mb-2">
        ¡Pedido Confirmado!
      </h1>

      <p className="text-ink-secondary mb-1">
        Gracias por tu compra. Hemos recibido tu pedido correctamente.
      </p>

      <p className="text-sm text-ink-tertiary mb-8">
        Número de pedido:{" "}
        <span className="font-mono font-semibold text-ink-primary">{orderNumber}</span>
      </p>

      <div className="bg-surface-50 rounded-2xl p-6 mb-8 text-left space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-secondary">Estado</span>
          <span className="text-emerald-600 font-medium">Procesando</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-secondary">Envío estimado</span>
          <span className="text-ink-primary">3-5 días hábiles</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-secondary">Confirmación</span>
          <span className="text-ink-primary">Enviada a tu email</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            Seguir Comprando
          </Button>
        </Link>
        <Link href="/account">
          <Button className="gap-2">
            Mis Pedidos
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
