import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { name: true, slug: true, images: { take: 1 } } },
          },
        },
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const { items, shippingAddress } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 })
    }

    // Calculate totals from database prices (never trust client prices)
    const productIds = items.map((i: { productId: string }) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    let subtotal = 0
    const orderItems = items.map((item: { productId: string; quantity: number; variant?: string }) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Producto ${item.productId} no encontrado.`)
      const lineTotal = Number(product.price) * item.quantity
      subtotal += lineTotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
        variantId: item.variant ?? undefined,
      }
    })

    const shipping = subtotal >= 50 ? 0 : 4.99
    const tax = subtotal * 0.21
    const total = subtotal + shipping + tax

    // Save address if provided
    if (shippingAddress) {
      await prisma.address.create({
        data: {
          userId: session.user.id,
          ...shippingAddress,
        },
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: shippingAddress || {},
        items: { create: orderItems },
      },
      include: { items: true },
    })

    // Decrement stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}
