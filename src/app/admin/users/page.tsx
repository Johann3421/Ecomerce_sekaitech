import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import Badge from "@/components/ui/Badge"

export const metadata: Metadata = { title: "Usuarios" }

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true, reviews: true } },
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary">Usuarios</h1>
        <p className="text-sm text-ink-secondary mt-1">
          {users.length} usuarios registrados
        </p>
      </div>

      <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-tertiary bg-surface-50 border-b border-surface-200">
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Pedidos</th>
                <th className="px-5 py-3 font-medium">Reseñas</th>
                <th className="px-5 py-3 font-medium">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <span className="font-medium text-ink-primary">
                        {user.name ?? "Sin nombre"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">{user.email}</td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={user.role === "ADMIN" ? "brand" : "default"}
                      size="sm"
                    >
                      {user.role === "ADMIN" ? "Admin" : "Cliente"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    {user._count.orders}
                  </td>
                  <td className="px-5 py-4 text-ink-secondary">
                    {user._count.reviews}
                  </td>
                  <td className="px-5 py-4 text-ink-tertiary text-xs">
                    {new Date(user.createdAt).toLocaleDateString("es-ES")}
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
