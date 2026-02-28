import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import Badge from "@/components/ui/Badge"

export const metadata: Metadata = { title: "Pedidos" }

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  })

  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    PROCESSING: "Procesando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  }

  const statusColors: Record<string, "warning" | "brand" | "success" | "danger"> = {
    PENDING: "warning",
    PROCESSING: "brand",
    SHIPPED: "brand",
    DELIVERED: "success",
    CANCELLED: "danger",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary">Pedidos</h1>
        <p className="text-sm text-ink-secondary mt-1">
          {orders.length} pedidos en total
        </p>
      </div>

      <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-tertiary bg-surface-50 border-b border-surface-200">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Productos</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    {new Date(order.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-ink-primary">{order.user?.name ?? "—"}</p>
                    <p className="text-xs text-ink-tertiary">{order.user?.email ?? "—"}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    <div className="max-w-xs">
                      {order.items.map((item, i) => (
                        <span key={item.id}>
                          {item.product.name} ×{item.quantity}
                          {i < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-ink-primary">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusColors[order.status] ?? "default"} size="sm">
                      {statusLabels[order.status] ?? order.status}
                    </Badge>
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
