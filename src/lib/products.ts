import { prisma } from "./prisma"
import { Prisma } from "@prisma/client"

interface FilterParams {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  color?: string
  size?: string
  sort?: string
  page?: string
}

const PRODUCTS_PER_PAGE = 12

export async function getFilteredProducts(params: FilterParams) {
  const page = parseInt(params.page || "1", 10)
  const skip = (page - 1) * PRODUCTS_PER_PAGE

  const where: Prisma.ProductWhereInput = {
    active: true,
  }

  // Text search
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { sku: { contains: params.q, mode: "insensitive" } },
    ]
  }

  // Category filter
  if (params.category) {
    where.category = { slug: params.category }
  }

  // Price range
  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice)
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice)
  }

  // Color filter (through variants)
  if (params.color) {
    where.variants = {
      some: { color: { contains: params.color, mode: "insensitive" } },
    }
  }

  // Size filter (through variants)
  if (params.size) {
    where.variants = {
      ...((where.variants as Prisma.ProductVariantListRelationFilter) || {}),
      some: {
        ...(
          (where.variants as Prisma.ProductVariantListRelationFilter)?.some as
            | Prisma.ProductVariantWhereInput
            | undefined
        ),
        size: { equals: params.size, mode: "insensitive" },
      },
    }
  }

  // Sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }
  switch (params.sort) {
    case "price_asc":
      orderBy = { price: "asc" }
      break
    case "price_desc":
      orderBy = { price: "desc" }
      break
    case "newest":
      orderBy = { createdAt: "desc" }
      break
    case "name_asc":
      orderBy = { name: "asc" }
      break
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" }, take: 2 },
        category: true,
        reviews: { select: { rating: true } },
        variants: true,
      },
      orderBy,
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products.map((p) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      avgRating:
        p.reviews.length > 0
          ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
          : 0,
      reviewCount: p.reviews.length,
    })),
    total,
    totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
    currentPage: page,
  }
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      variants: true,
      tags: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!product) return null

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0

  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    cost: product.cost ? Number(product.cost) : null,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : null,
    })),
    avgRating,
    reviewCount: product.reviews.length,
  }
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      active: true,
    },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
      reviews: { select: { rating: true } },
    },
    take: 4,
  })

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    avgRating:
      p.reviews.length > 0
        ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
        : 0,
    reviewCount: p.reviews.length,
  }))
}
