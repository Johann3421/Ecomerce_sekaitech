import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles } from "lucide-react"
import Button from "@/components/ui/Button"
import ProductGrid from "@/components/store/ProductGrid"
import HeroSceneWrapper from "@/components/three/HeroSceneWrapper"

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({ take: 4, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { featured: true, active: true },
      take: 8,
      include: {
        images: { orderBy: { position: "asc" }, take: 2 },
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const products = featuredProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    avgRating:
      p.reviews.length > 0
        ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
        : 0,
    reviewCount: p.reviews.length,
  }))

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-medium text-brand-700">
                  Nuevo: Colección Otoño 2024
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-ink-primary leading-[1.05]">
                Diseño que habla.{" "}
                <span className="text-brand-500">Calidad</span> que perdura.
              </h1>

              <p className="text-lg text-ink-secondary leading-relaxed max-w-lg">
                Descubre una selección curada de productos premium diseñados para
                transformar tu estilo de vida. Cada artículo cuenta una historia de
                artesanía y excelencia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button variant="primary" size="lg">
                    Explorar Colección
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products?sort=newest">
                  <Button variant="outline" size="lg">
                    Ver Novedades
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-ink-primary">2K+</p>
                  <p className="text-sm text-ink-tertiary">Productos</p>
                </div>
                <div className="w-px h-10 bg-surface-200" />
                <div>
                  <p className="text-2xl font-bold text-ink-primary">50K+</p>
                  <p className="text-sm text-ink-tertiary">Clientes felices</p>
                </div>
                <div className="w-px h-10 bg-surface-200" />
                <div>
                  <p className="text-2xl font-bold text-ink-primary">4.9</p>
                  <p className="text-sm text-ink-tertiary">Valoración</p>
                </div>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
              <HeroSceneWrapper />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-ink-primary">
              Explora por Categoría
            </h2>
            <p className="mt-3 text-lg text-ink-secondary">
              Encuentra lo que buscas en nuestra colección curada
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-semibold text-white">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm">Ver productos</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-ink-primary">
                Productos Destacados
              </h2>
              <p className="mt-3 text-lg text-ink-secondary">
                Lo mejor de nuestra selección, elegido para ti
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={products} />

          <div className="mt-10 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" size="md">
                Ver todos los productos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-ink-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Envío gratis en pedidos +$50
            </h2>
            <p className="mt-3 text-lg text-white/70">
              Porque la mejor experiencia de compra empieza con la entrega
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                <Truck className="w-7 h-7 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Envío Rápido</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Entrega en 2-4 días laborables. Seguimiento en tiempo real de tu pedido.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                <Shield className="w-7 h-7 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantía 2 Años</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Todos nuestros productos incluyen garantía completa. Tu compra protegida.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                <RotateCcw className="w-7 h-7 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Devolución Fácil</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                30 días para devolver. Sin preguntas, sin complicaciones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
