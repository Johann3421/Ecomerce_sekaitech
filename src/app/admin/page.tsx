import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import Badge from "@/components/ui/Badge"
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }

export default async function AdminDashboardPage() {
  const [
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    recentOrders,
    lowStockProducts,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } },
      },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, active: true },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, sku: true },
    }),
    prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { total: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ])

  const kpis = [
    {
      label: "Ingresos Totales",
      value: formatPrice(Number(totalRevenue._sum.total ?? 0)),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Pedidos",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Usuarios",
      value: totalUsers.toString(),
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Productos Activos",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-amber-600 bg-amber-100",
    },
  ]

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
        <h1 className="text-2xl font-bold text-ink-primary">Dashboard</h1>
        <p className="text-ink-secondary text-sm mt-1">
          Resumen general de tu tienda
        </p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-surface-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-ink-secondary">{label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-ink-primary">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-surface-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-ink-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            Pedidos Recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-tertiary border-b border-surface-200">
                  <th className="pb-3 font-medium">Pedido</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-50">
                    <td className="py-3 font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3">
                      <p className="text-ink-primary">{order.user?.name ?? "—"}</p>
                      <p className="text-xs text-ink-tertiary">{order.user?.email ?? "—"}</p>
                    </td>
                    <td className="py-3 text-ink-secondary">
                      {order.items.reduce((a, b) => a + b.quantity, 0)}
                    </td>
                    <td className="py-3 font-medium text-ink-primary">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="py-3">
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

        {/* Low Stock Alert */}
        <div className="bg-white border border-surface-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-ink-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Stock Bajo
          </h2>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{p.name}</p>
                    {p.sku && (
                      <p className="text-xs text-ink-tertiary font-mono">{p.sku}</p>
                    )}
                  </div>
                  <Badge variant={p.stock === 0 ? "danger" : "warning"} size="sm">
                    {p.stock === 0 ? "Agotado" : `${p.stock} uds`}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-tertiary">
              Todos los productos tienen stock suficiente.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
