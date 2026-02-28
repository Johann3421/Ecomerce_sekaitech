"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProductFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    description: string
    shortDesc: string | null
    price: number
    comparePrice: number | null
    stock: number
    sku: string | null
    categoryId: string
    featured: boolean
    active: boolean
  }
  categories: { id: string; name: string }[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!initialData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    shortDesc: initialData?.shortDesc ?? "",
    price: initialData?.price?.toString() ?? "",
    comparePrice: initialData?.comparePrice?.toString() ?? "",
    stock: initialData?.stock?.toString() ?? "0",
    sku: initialData?.sku ?? "",
    categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
    featured: initialData?.featured ?? false,
    active: initialData?.active ?? true,
  })

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock: parseInt(form.stock),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    }

    try {
      const url = isEditing
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products"

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Error al guardar.")
        setLoading(false)
        return
      }

      router.push("/admin/products")
      router.refresh()
    } catch {
      setError("Error de conexión.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-surface-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-surface-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-ink-primary">Información Básica</h2>

          <Input label="Nombre" value={form.name} onChange={update("name")} required />
          <Input
            label="Slug"
            value={form.slug}
            onChange={update("slug")}
            placeholder="auto-generado si se deja vacío"
            helperText="URL amigable (ej: producto-premium)"
          />
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={update("description")}
              rows={4}
              className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm bg-white text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
              required
            />
          </div>
          <Input
            label="Descripción corta"
            value={form.shortDesc}
            onChange={update("shortDesc")}
          />
        </div>

        {/* Pricing */}
        <div className="bg-white border border-surface-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-ink-primary">Precios y Stock</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Precio"
              type="number"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              required
            />
            <Input
              label="Precio anterior"
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={update("comparePrice")}
              helperText="Dejar vacío si no hay descuento"
            />
            <Input
              label="Stock"
              type="number"
              value={form.stock}
              onChange={update("stock")}
              required
            />
          </div>
          <Input label="SKU" value={form.sku} onChange={update("sku")} />
        </div>

        {/* Organization */}
        <div className="bg-white border border-surface-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-ink-primary">Organización</h2>

          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1.5">
              Categoría
            </label>
            <select
              value={form.categoryId}
              onChange={update("categoryId")}
              className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded border-surface-200 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm text-ink-primary">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
                className="w-4 h-4 rounded border-surface-200 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm text-ink-primary">Activo</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Guardar Cambios" : "Crear Producto"}
          </Button>
          <Link href="/admin/products">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </form>
  )
}
