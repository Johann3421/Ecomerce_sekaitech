'use client'

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, X } from "lucide-react"
import Button from "@/components/ui/Button"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const FREE_SHIPPING_THRESHOLD = 50

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-modal flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ink-primary" />
            <h2 className="text-lg font-semibold text-ink-primary">
              Carrito ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-50 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5 text-ink-secondary" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-surface-200 mb-4" />
              <p className="text-lg font-medium text-ink-primary mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-ink-tertiary mb-6">
                Explora nuestra tienda y encuentra productos increíbles
              </p>
              <Button variant="primary" onClick={onClose}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-surface-50"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="text-sm font-medium text-ink-primary hover:text-brand-600 line-clamp-1 transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-xs text-ink-tertiary mt-0.5">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-ink-primary mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-ink-tertiary hover:text-red-500 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-surface-200 px-6 py-4 space-y-4">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-ink-secondary text-center">
                  Faltan <span className="font-semibold text-brand-600">{formatPrice(remainingForFreeShipping)}</span> para envío gratis
                </p>
                <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 font-medium text-center">
                🎉 ¡Envío gratis incluido!
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-secondary">Subtotal</span>
              <span className="text-lg font-bold text-ink-primary">
                {formatPrice(total)}
              </span>
            </div>

            <Link href="/checkout" onClick={onClose} className="block">
              <Button variant="primary" size="lg" className="w-full">
                Proceder al Pago
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-sm text-ink-tertiary hover:text-red-500 transition-colors text-center"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  )
}
