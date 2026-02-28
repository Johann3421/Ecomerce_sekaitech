import { Suspense } from "react"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getFilteredProducts } from "@/lib/products"
import ProductGrid from "@/components/store/ProductGrid"
import FilterSidebar from "@/components/store/FilterSidebar"
import { ProductGridSkeleton } from "@/components/ui/Skeleton"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Productos — Catálogo Completo",
  description: "Explora nuestra colección completa de productos premium. Electrónica, moda, hogar y accesorios.",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const safeParams = {
    q: typeof params.q === 'string' ? params.q : undefined,
    category: typeof params.category === 'string' ? params.category : undefined,
    minPrice: typeof params.minPrice === 'string' ? params.minPrice : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? params.maxPrice : undefined,
    color: typeof params.color === 'string' ? params.color : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
    sort: typeof params.sort === 'string' ? params.sort : undefined,
    page: typeof params.page === 'string' ? params.page : undefined,
  }

  const [{ products, total, totalPages, currentPage }, categories, variants] =
    await Promise.all([
      getFilteredProducts(safeParams),
      prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
      prisma.productVariant.findMany({
        select: { color: true, size: true },
        distinct: ["color", "size"],
      }),
    ])

  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[]
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[]

  const sortOptions = [
    { value: "", label: "Relevancia" },
    { value: "price_asc", label: "Precio: menor a mayor" },
    { value: "price_desc", label: "Precio: mayor a menor" },
    { value: "newest", label: "Más recientes" },
    { value: "name_asc", label: "A-Z" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-ink-primary">
          {safeParams.q ? `Resultados para "${safeParams.q}"` : "Todos los Productos"}
        </h1>
        <p className="mt-2 text-ink-secondary">
          {total} producto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <FilterSidebar
          categories={categories}
          colors={colors}
          sizes={sizes}
          maxProductPrice={3000}
        />

        {/* Products */}
        <div className="flex-1">
          {/* Sort + Mobile Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="lg:hidden">
              <FilterSidebar
                categories={categories}
                colors={colors}
                sizes={sizes}
                maxProductPrice={3000}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort" className="text-sm text-ink-secondary whitespace-nowrap">
                Ordenar por:
              </label>
              <SortSelect options={sortOptions} currentSort={safeParams.sort || ""} />
            </div>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              searchParams={safeParams}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function SortSelect({
  options,
  currentSort,
}: {
  options: { value: string; label: string }[]
  currentSort: string
}) {
  return (
    <form>
      <select
        name="sort"
        id="sort"
        defaultValue={currentSort}
        onChange={(e) => {
          const url = new URL(window.location.href)
          if (e.target.value) {
            url.searchParams.set("sort", e.target.value)
          } else {
            url.searchParams.delete("sort")
          }
          window.location.href = url.toString()
        }}
        className="px-3 py-2 text-sm border border-surface-200 rounded-xl bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  )
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value)
    })
    if (page > 1) params.set("page", page.toString())
    const qs = params.toString()
    return `/products${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-2 rounded-xl border border-surface-200 text-ink-secondary hover:bg-surface-50 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            page === currentPage
              ? "bg-brand-500 text-white shadow-sm"
              : "text-ink-secondary hover:bg-surface-50 border border-surface-200"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-2 rounded-xl border border-surface-200 text-ink-secondary hover:bg-surface-50 transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
