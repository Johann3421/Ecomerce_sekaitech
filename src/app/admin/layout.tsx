import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import AdminSidebar from "@/components/admin/AdminSidebar"

export const dynamic = 'force-dynamic'

export const metadata = { title: { template: "%s | Admin LumiStore", default: "Admin" } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
    </div>
  )
}
