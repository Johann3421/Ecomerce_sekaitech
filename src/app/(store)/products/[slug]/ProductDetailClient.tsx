"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useCart } from "@/hooks/useCart"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import {
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Package,
  ChevronDown,
  Box,
  ImageIcon,
} from "lucide-react"

const ProductViewer3D = dynamic(() => import("@/components/three/ProductViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-surface-50 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <Box className="w-8 h-8 text-ink-tertiary mx-auto animate-pulse" />
        <p className="text-sm text-ink-tertiary mt-2">Cargando vista 3D...</p>
      </div>
    </div>
  ),
})

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    shortDesc: string | null
    price: number
    comparePrice: number | null
    stock: number
    sku: string
    featured: boolean
    avgRating: number
    reviewCount: number
    category: { name: string; slug: string }
    images: { id: string; url: string; alt: string | null; position: number }[]
    variants: { id: string; name: string; sku: string; price: number | null; stock: number; color: string | null; size: string | null }[]
    tags: { id: string; name: string }[]
  }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [viewMode, setViewMode] = useState<"images" | "3d">("images")
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isWishlist, setIsWishlist] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>("description")
  const [addedToCart, setAddedToCart] = useState(false)

  // Group variants by color and size
  const variantGroups = useMemo(() => {
    const groups: Record<string, { id: string; value: string; price: number | null; stock: number }[]> = {}
    const seenColors = new Set<string>()
    const seenSizes = new Set<string>()
    product.variants.forEach((v) => {
      if (v.color && !seenColors.has(v.color)) {
        seenColors.add(v.color)
        if (!groups["Color"]) groups["Color"] = []
        groups["Color"].push({ id: v.id, value: v.color, price: v.price, stock: v.stock })
      }
      if (v.size && !seenSizes.has(v.size)) {
        seenSizes.add(v.size)
        if (!groups["Talla"]) groups["Talla"] = []
        groups["Talla"].push({ id: v.id, value: v.size, price: v.price, stock: v.stock })
      }
    })
    return groups
  }, [product.variants])

  // Calculate effective price based on selected variant
  const effectivePrice = useMemo(() => {
    const selectedColor = selectedVariants["Color"]
    const selectedSize = selectedVariants["Talla"]
    if (!selectedColor && !selectedSize) return product.price
    const matched = product.variants.find((v) => {
      if (selectedColor && v.color !== selectedColor) return false
      if (selectedSize && v.size !== selectedSize) return false
      return true
    })
    return matched?.price ?? product.price
  }, [product.price, product.variants, selectedVariants])

  const discount = product.comparePrice
    ? calculateDiscount(product.comparePrice, effectivePrice)
    : 0

  const handleQuantity = useCallback(
    (delta: number) => {
      setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock)))
    },
    [product.stock]
  )

  const handleAddToCart = useCallback(() => {
    const variantLabel = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ") || undefined
    const matchedVariant = product.variants.find((v) => {
      const sc = selectedVariants["Color"]
      const ss = selectedVariants["Talla"]
      if (sc && v.color !== sc) return false
      if (ss && v.size !== ss) return false
      return true
    })
    addItem({
      id: matchedVariant ? `${product.id}-${matchedVariant.id}` : product.id,
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      image: product.images[0]?.url ?? "",
      slug: product.slug,
      quantity,
      variantId: matchedVariant?.id,
      variantName: variantLabel,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }, [addItem, product, effectivePrice, quantity, selectedVariants])

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/products/${product.slug}`
    if (navigator.share) {
      await navigator.share({ title: product.name, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }, [product.slug, product.name])

  const sortedImages = useMemo(
    () => [...product.images].sort((a, b) => a.position - b.position),
    [product.images]
  )

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
      {/* LEFT — Gallery / 3D Viewer */}
      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setViewMode("images")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "images"
                ? "bg-brand-500 text-white"
                : "bg-surface-100 text-ink-secondary hover:bg-surface-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Fotos
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "3d"
                ? "bg-brand-500 text-white"
                : "bg-surface-100 text-ink-secondary hover:bg-surface-200"
            }`}
          >
            <Box className="w-4 h-4" />
            Vista 3D
          </button>
        </div>

        {viewMode === "images" ? (
          <>
            {/* Main Image */}
            <div className="relative aspect-square bg-surface-50 rounded-2xl overflow-hidden group">
              {sortedImages[selectedImage] && (
                <Image
                  src={sortedImages[selectedImage].url}
                  alt={sortedImages[selectedImage].alt ?? product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <Badge variant="danger">-{discount}%</Badge>
                )}
                {product.featured && (
                  <Badge variant="brand">Destacado</Badge>
                )}
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="default">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {sortedImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-brand-500 ring-2 ring-brand-500/20"
                        : "border-surface-200 hover:border-surface-200/80"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? `${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-50">
            <ProductViewer3D category={product.category.slug} />
          </div>
        )}
      </div>

      {/* RIGHT — Product Info */}
      <div className="flex flex-col">
        {/* Category */}
        <p className="text-sm font-medium text-brand-500 uppercase tracking-wider mb-2">
          {product.category.name}
        </p>

        {/* Name */}
        <h1 className="text-3xl lg:text-4xl font-bold text-ink-primary leading-tight">
          {product.name}
        </h1>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-surface-200 text-surface-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-ink-secondary">
              {product.avgRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-ink-tertiary mt-2">SKU: {product.sku}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mt-5">
          <span className="text-3xl font-bold text-ink-primary">
            {formatPrice(effectivePrice)}
          </span>
          {product.comparePrice && (
            <span className="text-lg text-ink-tertiary line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
          {discount > 0 && (
            <Badge variant="danger" size="sm">
              Ahorras {formatPrice(product.comparePrice! - effectivePrice)}
            </Badge>
          )}
        </div>

        {/* Short Description */}
        {product.shortDesc && (
          <p className="text-ink-secondary mt-4 leading-relaxed">
            {product.shortDesc}
          </p>
        )}

        <div className="h-px bg-surface-200 my-6" />

        {/* Variant Selectors */}
        {Object.entries(variantGroups).map(([groupName, values]) => (
          <div key={groupName} className="mb-5">
            <label className="text-sm font-semibold text-ink-primary mb-2 block">
              {groupName}
              {selectedVariants[groupName] && (
                <span className="font-normal text-ink-secondary ml-2">
                  — {selectedVariants[groupName]}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {values.map((v) => {
                const isSelected = selectedVariants[groupName] === v.value
                const isColor = groupName.toLowerCase() === "color"
                const outOfStock = v.stock === 0

                return (
                  <button
                    key={v.id}
                    disabled={outOfStock}
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [groupName]: isSelected ? "" : v.value,
                      }))
                    }
                    className={`
                      ${
                        isColor
                          ? `w-9 h-9 rounded-full border-2 ${
                              isSelected
                                ? "border-brand-500 ring-2 ring-brand-500/20"
                                : "border-surface-200"
                            }`
                          : `px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              isSelected
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-surface-200 text-ink-primary hover:border-brand-300"
                            }`
                      }
                      ${outOfStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}
                    `}
                    title={outOfStock ? `${v.value} — Agotado` : v.value}
                  >
                    {!isColor && v.value}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-4 mt-2">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-surface-200 rounded-xl overflow-hidden">
            <button
              onClick={() => handleQuantity(-1)}
              disabled={quantity <= 1}
              className="px-3 py-3 text-ink-secondary hover:bg-surface-50 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-semibold text-ink-primary select-none">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantity(1)}
              disabled={quantity >= product.stock}
              className="px-3 py-3 text-ink-secondary hover:bg-surface-50 disabled:opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart */}
          <Button
            className="flex-1"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {addedToCart
              ? "¡Añadido!"
              : product.stock === 0
                ? "Agotado"
                : "Añadir al Carrito"}
          </Button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlist(!isWishlist)}
            className={`p-3 rounded-xl border transition-all ${
              isWishlist
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-surface-200 text-ink-tertiary hover:text-red-500 hover:border-red-200"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isWishlist ? "fill-current" : ""}`}
            />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-3 rounded-xl border border-surface-200 text-ink-tertiary hover:text-brand-500 hover:border-brand-200 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="mt-4">
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-sm text-amber-600 font-medium">
              ¡Solo quedan {product.stock} unidades!
            </p>
          )}
          {product.stock > 5 && (
            <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              <Package className="w-4 h-4" /> En stock
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-red-500 font-medium">Agotado</p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Truck, label: "Envío gratis", sub: "Pedidos +$50" },
            { icon: Shield, label: "Pago seguro", sub: "SSL 256-bit" },
            { icon: RotateCcw, label: "Devolución", sub: "30 días" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-3 bg-surface-50 rounded-xl"
            >
              <Icon className="w-5 h-5 text-brand-500 mb-1" />
              <span className="text-xs font-semibold text-ink-primary">{label}</span>
              <span className="text-[10px] text-ink-tertiary">{sub}</span>
            </div>
          ))}
        </div>

        {/* Accordions */}
        <div className="mt-8 space-y-0 border border-surface-200 rounded-2xl overflow-hidden">
          {[
            {
              id: "description",
              title: "Descripción",
              content: product.description,
            },
            {
              id: "shipping",
              title: "Envío y Devoluciones",
              content:
                "Envío estándar gratuito en pedidos superiores a $50. Entrega estimada de 3-5 días hábiles. Devoluciones gratuitas dentro de los 30 días posteriores a la recepción del pedido. El artículo debe estar sin usar y en su embalaje original.",
            },
            {
              id: "care",
              title: "Cuidados del Producto",
              content:
                "Para mantener tu producto en las mejores condiciones, sigue las instrucciones de cuidado incluidas en el embalaje. Evita la exposición prolongada a la luz solar directa y la humedad extrema.",
            },
          ].map(({ id, title, content }) => (
            <div key={id} className="border-b border-surface-200 last:border-b-0">
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === id ? null : id)
                }
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors"
              >
                <span className="font-semibold text-ink-primary">{title}</span>
                <ChevronDown
                  className={`w-5 h-5 text-ink-tertiary transition-transform ${
                    openAccordion === id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === id && (
                <div className="px-5 pb-4 text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
