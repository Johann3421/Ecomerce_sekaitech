import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Debe contener mayúsculas, minúsculas y números"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const productSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  slug: z.string().min(2, "El slug es requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  shortDesc: z.string().optional(),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  cost: z.coerce.number().positive().optional().nullable(),
  sku: z.string().min(2, "El SKU es requerido"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  weight: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "La categoría es requerida"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastName: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(7, "Teléfono requerido"),
  address1: z.string().min(5, "Dirección requerida"),
  address2: z.string().optional(),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Estado/Provincia requerida"),
  zip: z.string().min(3, "Código postal requerido"),
  country: z.string().min(2, "País requerido"),
  notes: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, "El comentario debe tener al menos 10 caracteres"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
