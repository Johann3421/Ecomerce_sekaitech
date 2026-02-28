import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getProductBySlug, getRelatedProducts } from "@/lib/products"
import ProductDetailClient from "./ProductDetailClient"
import ProductGrid from "@/components/store/ProductGrid"
import ReviewCard from "@/components/store/ReviewCard"
import { Star } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  })

  if (!product) return { title: "Producto no encontrado" }

  return {
    title: product.name,
    description: product.shortDesc ?? product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.shortDesc ?? "",
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt ?? product.name,
      })),
      type: "website",
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "USD",
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const avgRating = product.avgRating
  const reviewCount = product.reviewCount

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: product.reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviewCount > 0
        ? (product.reviews.filter((r) => r.rating === rating).length / reviewCount) * 100
        : 0,
  }))

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { "@type": "Brand", name: "LumiStore" },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price.toString(),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "LumiStore" },
    },
    ...(avgRating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: reviewCount,
          },
        }
      : {}),
  }

  const relatedForGrid = relatedProducts.map((p) => ({
    ...p,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ink-tertiary mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-ink-primary transition-colors">Inicio</a>
          <span>/</span>
          <a href={`/category/${product.category.slug}`} className="hover:text-ink-primary transition-colors">
            {product.category.name}
          </a>
          <span>/</span>
          <span className="text-ink-primary font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Detail (Client Component for interactivity) */}
        <ProductDetailClient product={product} />

        {/* Reviews Section */}
        <section className="mt-16 border-t border-surface-200 pt-12">
          <h2 className="text-2xl font-bold text-ink-primary mb-8">
            Opiniones de Clientes
          </h2>

          {reviewCount > 0 ? (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-surface-50 rounded-2xl p-6">
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-ink-primary">
                      {avgRating.toFixed(1)}
                    </p>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(avgRating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-surface-200 text-surface-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-ink-secondary mt-1">
                      {reviewCount} opinione{reviewCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ratingBreakdown.map((rb) => (
                      <div key={rb.rating} className="flex items-center gap-2">
                        <span className="text-sm text-ink-secondary w-3">
                          {rb.rating}
                        </span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${rb.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink-tertiary w-6 text-right">
                          {rb.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="lg:col-span-2 space-y-6">
                {product.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-50 rounded-2xl">
              <p className="text-ink-secondary">
                Aún no hay opiniones. ¡Sé el primero en opinar!
              </p>
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedForGrid.length > 0 && (
          <section className="mt-16 border-t border-surface-200 pt-12">
            <h2 className="text-2xl font-bold text-ink-primary mb-8">
              Productos Relacionados
            </h2>
            <ProductGrid products={relatedForGrid} />
          </section>
        )}
      </div>
    </>
  )
}
