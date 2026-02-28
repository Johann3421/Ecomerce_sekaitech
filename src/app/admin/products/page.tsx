import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import { Plus, Edit, Eye } from "lucide-react"

export const metadata: Metadata = { title: "Productos" }

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { position: "asc" } },
      _count: { select: { reviews: true, orderItems: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">Productos</h1>
          <p className="text-sm text-ink-secondary mt-1">
            {products.length} productos en total
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-tertiary bg-surface-50 border-b border-surface-200">
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">Precio</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium">Ventas</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-surface-100"
                        />
                      )}
                      <div>
                        <p className="font-medium text-ink-primary line-clamp-1">
                          {product.name}
                        </p>
                        {product.sku && (
                          <p className="text-xs text-ink-tertiary font-mono">
                            {product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    {product.category.name}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-ink-primary">
                      {formatPrice(Number(product.price))}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs text-ink-tertiary line-through ml-1">
                        {formatPrice(Number(product.comparePrice))}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        product.stock === 0
                          ? "danger"
                          : product.stock <= 5
                            ? "warning"
                            : "success"
                      }
                      size="sm"
                    >
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    {product.avgRating > 0 ? `${product.avgRating.toFixed(1)} ★` : "—"}
                    <span className="text-xs text-ink-tertiary ml-1">
                      ({product._count.reviews})
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    {product._count.orderItems}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={product.active ? "success" : "default"}
                      size="sm"
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-1.5 rounded-lg text-ink-tertiary hover:text-brand-500 hover:bg-brand-50 transition-colors"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 rounded-lg text-ink-tertiary hover:text-brand-500 hover:bg-brand-50 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
