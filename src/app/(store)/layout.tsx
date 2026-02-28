import Navbar from "@/components/store/Navbar"
import Footer from "@/components/store/Footer"
import { ToastProvider } from "@/components/ui/Toast"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await prisma.category.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  })

  return (
    <ToastProvider>
      <Navbar categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ToastProvider>
  )
}
