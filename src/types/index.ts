export interface SearchParams {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  color?: string
  size?: string
  sort?: string
  page?: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  price: number
  quantity: number
  variantId?: string
  variantName?: string
}

export interface ProductWithRelations {
  id: string
  name: string
  slug: string
  description: string
  shortDesc: string | null
  price: number
  comparePrice: number | null
  cost: number | null
  sku: string
  stock: number
  weight: number | null
  model3dUrl: string | null
  featured: boolean
  active: boolean
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
  images: {
    id: string
    url: string
    alt: string | null
    position: number
  }[]
  variants: {
    id: string
    name: string
    sku: string
    price: number | null
    stock: number
    color: string | null
    size: string | null
  }[]
  reviews: {
    id: string
    rating: number
    title: string | null
    body: string
    verified: boolean
    createdAt: Date
    user: {
      name: string | null
      image: string | null
    }
  }[]
}

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      role: string
    }
  }

  interface User {
    role?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string
    id?: string
  }
}
