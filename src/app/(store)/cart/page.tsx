"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/useCart"
import Button from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Truck } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  const FREE_SHIPPING_THRESHOLD = 50
  const shippingProgress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = FREE_SHIPPING_THRESHOLD - totalPrice

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-ink-primary mb-2">Tu carrito está vacío</h1>
        <p className="text-ink-secondary mb-6">
          Explora nuestra tienda y encuentra productos increíbles.
        </p>
        <Link href="/products">
          <Button>Explorar Productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ink-primary mb-8">
        Carrito de Compras
        <span className="text-lg font-normal text-ink-tertiary ml-2">
          ({totalItems} artículo{totalItems !== 1 ? "s" : ""})
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.variantId ?? ""}`}
              className="flex gap-4 bg-white border border-surface-200 rounded-2xl p-4 transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <Link
                href={`/products/${item.slug}`}
                className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-surface-50"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-ink-primary hover:text-brand-500 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-sm text-ink-tertiary mt-0.5">{item.variantName}</p>
                    )}
                  </div>
                  <p className="font-bold text-ink-primary whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                {/* Price per unit */}
                <p className="text-sm text-ink-tertiary mt-1">
                  {formatPrice(item.price)} c/u
                </p>

                {/* Quantity + Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2.5 py-1.5 text-ink-secondary hover:bg-surface-50 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-ink-primary select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-ink-secondary hover:bg-surface-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-ink-tertiary hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm text-ink-secondary hover:text-brand-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Seguir comprando
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-ink-primary mb-4">
              Resumen del Pedido
            </h2>

            {/* Free shipping progress */}
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-secondary flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Envío gratis
                </span>
                {remaining > 0 ? (
                  <span className="text-ink-tertiary">
                    Faltan {formatPrice(remaining)}
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium">¡Conseguido!</span>
                )}
              </div>
              <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Subtotal</span>
                <span className="text-ink-primary font-medium">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Envío</span>
                <span className="text-ink-primary font-medium">
                  {totalPrice >= FREE_SHIPPING_THRESHOLD ? "Gratis" : formatPrice(4.99)}
                </span>
              </div>
              <div className="h-px bg-surface-200" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-ink-primary">Total</span>
                <span className="font-bold text-ink-primary">
                  {formatPrice(
                    totalPrice + (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99)
                  )}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                Proceder al Pago
              </Button>
            </Link>

            <p className="text-xs text-ink-tertiary text-center mt-3">
              Impuestos calculados en el checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
