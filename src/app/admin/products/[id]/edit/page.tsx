import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/ProductForm"

export const metadata: Metadata = { title: "Editar Producto" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ])

  if (!product) notFound()

  return (
    <ProductForm
      initialData={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDesc: product.shortDesc,
        price: Number(product.price),
        comparePrice: Number(product.comparePrice),
        stock: product.stock,
        sku: product.sku,
        categoryId: product.categoryId,
        featured: product.featured,
        active: product.active,
      }}
      categories={categories}
    />
  )
}
