'use client'

import { useCartStore } from "@/store/cart"

export function useCart() {
  const store = useCartStore()
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    totalItems: store.totalItems(),
    totalPrice: store.totalPrice(),
    isEmpty: store.items.length === 0,
  }
}
