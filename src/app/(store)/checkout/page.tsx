"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useCart } from "@/hooks/useCart"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { formatPrice } from "@/lib/utils"
import { CreditCard, Truck, CheckCircle, ChevronLeft, Lock } from "lucide-react"

type Step = "shipping" | "payment" | "review"

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart, totalItems } = useCart()
  const [step, setStep] = useState<Step>("shipping")
  const [isProcessing, setIsProcessing] = useState(false)

  const FREE_SHIPPING = totalPrice >= 50

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ShippingForm>({
    defaultValues: { country: "ES" },
  })

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-primary mb-2">
          No hay productos en tu carrito
        </h1>
        <p className="text-ink-secondary mb-6">Añade productos antes de continuar.</p>
        <Button onClick={() => router.push("/products")}>Ver Productos</Button>
      </div>
    )
  }

  const steps: { key: Step; label: string; icon: typeof Truck }[] = [
    { key: "shipping", label: "Envío", icon: Truck },
    { key: "payment", label: "Pago", icon: CreditCard },
    { key: "review", label: "Confirmar", icon: CheckCircle },
  ]

  const currentIndex = steps.findIndex((s) => s.key === step)

  const onShippingSubmit = () => setStep("payment")
  const onPaymentSubmit = () => setStep("review")

  const onPlaceOrder = async () => {
    setIsProcessing(true)
    // Simulated order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    clearCart()
    router.push("/checkout/success")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ink-primary mb-8">Checkout</h1>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon
          const isActive = i === currentIndex
          const isDone = i < currentIndex
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-brand-500 text-white"
                      : isDone
                        ? "bg-emerald-500 text-white"
                        : "bg-surface-200 text-ink-tertiary"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    isActive ? "text-ink-primary" : "text-ink-tertiary"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 ${
                    isDone ? "bg-emerald-500" : "bg-surface-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form Area */}
        <div className="lg:col-span-3">
          {step === "shipping" && (
            <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-5">
              <h2 className="text-xl font-bold text-ink-primary mb-4">
                Dirección de Envío
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  {...register("firstName", { required: "Requerido" })}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Apellido"
                  {...register("lastName", { required: "Requerido" })}
                  error={errors.lastName?.message}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  {...register("email", {
                    required: "Requerido",
                    pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                  })}
                  error={errors.email?.message}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  {...register("phone", { required: "Requerido" })}
                  error={errors.phone?.message}
                />
              </div>

              <Input
                label="Dirección"
                {...register("street", { required: "Requerido" })}
                error={errors.street?.message}
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="Ciudad"
                  {...register("city", { required: "Requerido" })}
                  error={errors.city?.message}
                />
                <Input
                  label="Provincia/Estado"
                  {...register("state", { required: "Requerido" })}
                  error={errors.state?.message}
                />
                <Input
                  label="Código Postal"
                  {...register("zipCode", { required: "Requerido" })}
                  error={errors.zipCode?.message}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continuar al Pago
              </Button>
            </form>
          )}

          {step === "payment" && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onPaymentSubmit()
              }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="text-ink-tertiary hover:text-ink-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-ink-primary">
                  Información de Pago
                </h2>
              </div>

              <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 space-y-4">
                <Input label="Nombre en la tarjeta" placeholder="John Doe" required />
                <Input
                  label="Número de tarjeta"
                  placeholder="4242 4242 4242 4242"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Vencimiento" placeholder="MM/AA" required />
                  <Input label="CVV" placeholder="123" type="password" required />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
                <Lock className="w-3.5 h-3.5" />
                <span>Tu información de pago está encriptada y segura.</span>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Revisar Pedido
              </Button>
            </form>
          )}

          {step === "review" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep("payment")}
                  className="text-ink-tertiary hover:text-ink-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-ink-primary">
                  Revisar y Confirmar
                </h2>
              </div>

              {/* Shipping Summary */}
              <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5">
                <h3 className="font-semibold text-ink-primary text-sm mb-2">
                  Dirección de Envío
                </h3>
                <p className="text-sm text-ink-secondary">
                  {getValues("firstName")} {getValues("lastName")}
                  <br />
                  {getValues("street")}
                  <br />
                  {getValues("city")}, {getValues("state")} {getValues("zipCode")}
                </p>
              </div>

              {/* Items */}
              <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5">
                <h3 className="font-semibold text-ink-primary text-sm mb-3">
                  Productos ({totalItems})
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId ?? ""}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-ink-secondary">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-ink-primary font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={onPlaceOrder}
                isLoading={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Confirmar Pedido"}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-ink-primary mb-4">
              Resumen
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variantId ?? ""}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-lg bg-surface-100 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-primary truncate">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs text-ink-tertiary">{item.variantName}</p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-ink-primary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Subtotal</span>
                <span className="text-ink-primary">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Envío</span>
                <span className="text-ink-primary">
                  {FREE_SHIPPING ? "Gratis" : formatPrice(4.99)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-surface-200">
                <span>Total</span>
                <span>
                  {formatPrice(totalPrice + (FREE_SHIPPING ? 0 : 4.99))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
