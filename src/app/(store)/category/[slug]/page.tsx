import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getFilteredProducts } from "@/lib/products"
import ProductGrid from "@/components/store/ProductGrid"
import FilterSidebar from "@/components/store/FilterSidebar"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return { title: "Categoría no encontrada" }

  return {
    title: category.name,
    description: category.description ?? `Explora nuestra colección de ${category.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  const filters = {
    category: slug,
    q: (sp.q as string) ?? "",
    minPrice: (sp.minPrice as string) ?? undefined,
    maxPrice: (sp.maxPrice as string) ?? undefined,
    color: (sp.color as string) ?? "",
    size: (sp.size as string) ?? "",
    sort: (sp.sort as string) ?? "newest",
    page: (sp.page as string) ?? "1",
  }

  const { products, total, totalPages: pages, currentPage: page } = await getFilteredProducts(filters)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-tertiary mb-6">
        <a href="/" className="hover:text-ink-primary transition-colors">Inicio</a>
        <span>/</span>
        <span className="text-ink-primary font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-ink-primary">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-ink-secondary max-w-2xl">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-ink-tertiary">
          {total} producto{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-8">
        <FilterSidebar categories={allCategories} colors={[]} sizes={[]} maxProductPrice={3000} />

        <div className="flex-1">
          <ProductGrid products={products} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/category/${slug}?page=${p}${sp.sort ? `&sort=${sp.sort}` : ""}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-brand-500 text-white"
                      : "bg-surface-100 text-ink-secondary hover:bg-surface-200"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
