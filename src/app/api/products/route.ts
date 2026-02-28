import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q") ?? ""
    const category = searchParams.get("category") ?? ""
    const sort = searchParams.get("sort") ?? "newest"
    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)))

    const where: Record<string, unknown> = { active: true }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    const orderBy = (() => {
      switch (sort) {
        case "price_asc": return { price: "asc" as const }
        case "price_desc": return { price: "desc" as const }
        case "name_asc": return { name: "asc" as const }
        case "popular": return { avgRating: "desc" as const }
        default: return { createdAt: "desc" as const }
      }
    })()

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { position: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}
