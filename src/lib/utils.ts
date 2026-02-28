import { type ClassValue, clsx } from "clsx"

// Simple cn utility without tailwind-merge for Tailwind v4
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number | string, currency = "USD"): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numPrice)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateSKU(name: string): string {
  const prefix = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 3)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${random}`
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function calculateDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}
