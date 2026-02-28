import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function checkAdmin() {
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const product = await prisma.product.update({ where: { id }, data: body })
    return NextResponse.json({ product })
  } catch (error) {
    console.error("Admin product PUT:", error)
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  try {
    const { id } = await params
    await prisma.product.update({ where: { id }, data: { active: false } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin product DELETE:", error)
    return NextResponse.json({ error: "Error al eliminar." }, { status: 500 })
  }
}
