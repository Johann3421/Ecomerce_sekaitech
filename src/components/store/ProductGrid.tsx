'use client'

import ProductCard from "./ProductCard"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  featured: boolean
  images: { url: string; alt: string | null }[]
  category: { name: string; slug: string }
  avgRating?: number
  reviewCount?: number
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-ink-primary mb-1">
          No se encontraron productos
        </h3>
        <p className="text-sm text-ink-secondary">
          Intenta ajustar los filtros o busca algo diferente
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
