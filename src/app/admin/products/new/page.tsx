import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/ProductForm"

export const metadata: Metadata = { title: "Nuevo Producto" }

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  return <ProductForm categories={categories} />
}
