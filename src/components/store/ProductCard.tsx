"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Star } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import Badge from "@/components/ui/Badge"
import { useState } from "react"

interface ProductCardProps {
  product: {
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || "",
      price: product.price,
    })
  }

  const initialImage = product.images[0]?.url || "/images/placeholder.svg"
  const [imgSrc, setImgSrc] = useState(initialImage)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-surface-0 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-100">
        <Image
          src={imgSrc}
          alt={product.images[0]?.alt || product.name}
          fill
          onError={() => setImgSrc("/images/placeholder.svg")}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="danger" size="sm">
              -{discount}%
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="default" size="sm">
              Agotado
            </Badge>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <Badge variant="warning" size="sm">
              Últimas unidades
            </Badge>
          )}
        </div>

        {/* Quick Add */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-brand-500 hover:text-white text-ink-primary"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-ink-tertiary mb-1">
          {product.category.name}
        </p>
        <h3 className="text-sm font-semibold text-ink-primary line-clamp-1 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avgRating && product.avgRating > 0 ? (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-ink-secondary">
              {product.avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-ink-tertiary">
              ({product.reviewCount})
            </span>
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-ink-primary">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-ink-tertiary line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
