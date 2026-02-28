"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  Store,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-surface-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-200">
        <Link href="/admin" className="text-xl font-bold text-brand-500">
          LumiStore
        </Link>
        <p className="text-xs text-ink-tertiary mt-0.5">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-ink-secondary hover:bg-surface-50 hover:text-ink-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to store */}
      <div className="p-4 border-t border-surface-200">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:bg-surface-50 hover:text-ink-primary transition-colors"
        >
          <Store className="w-5 h-5" />
          Volver a la tienda
        </Link>
      </div>
    </aside>
  )
}
