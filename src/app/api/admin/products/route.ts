import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return false
  return true
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  try {
    const body = await req.json()
    const product = await prisma.product.create({ data: body })
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Admin products POST:", error)
    return NextResponse.json({ error: "Error al crear producto." }, { status: 500 })
  }
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: true },
  })

  return NextResponse.json({ products })
}
