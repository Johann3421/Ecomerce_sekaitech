import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Package, MapPin, User, LogOut } from "lucide-react"
import Badge from "@/components/ui/Badge"

export const metadata: Metadata = { title: "Mi Cuenta" }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/account")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: { include: { product: true } } },
      },
      addresses: true,
    },
  })

  if (!user) redirect("/login")

  const statusColors: Record<string, "brand" | "warning" | "success" | "danger"> = {
    PENDING: "warning",
    PROCESSING: "brand",
    SHIPPED: "brand",
    DELIVERED: "success",
    CANCELLED: "danger",
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    PROCESSING: "Procesando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ink-primary mb-8">Mi Cuenta</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Info */}
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div>
                <h2 className="font-semibold text-ink-primary">{user.name}</h2>
                <p className="text-sm text-ink-tertiary">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <User className="w-4 h-4" />
              <span>Miembro desde {new Date(user.createdAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <h3 className="font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              Direcciones
            </h3>
            {user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="text-sm text-ink-secondary">
                    <p>{addr.address1}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p>{addr.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-tertiary">No hay direcciones guardadas.</p>
            )}
          </div>

          {/* Sign Out */}
          <a
            href="/api/auth/signout"
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors px-1"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </a>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-ink-primary mb-5 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-500" />
            Mis Pedidos
          </h2>

          {user.orders.length > 0 ? (
            <div className="space-y-4">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-surface-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-ink-tertiary">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-ink-tertiary">
                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant={statusColors[order.status] ?? "default"}>
                      {statusLabels[order.status] ?? order.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-ink-secondary">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-ink-primary font-medium">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-surface-200 pt-2 flex justify-between">
                    <span className="text-sm font-semibold text-ink-primary">Total</span>
                    <span className="text-sm font-bold text-ink-primary">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-50 rounded-2xl">
              <Package className="w-10 h-10 text-ink-tertiary mx-auto mb-3" />
              <p className="text-ink-secondary">Aún no tienes pedidos.</p>
              <a
                href="/products"
                className="text-sm text-brand-500 font-semibold hover:text-brand-600 mt-2 inline-block"
              >
                Explorar Productos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
