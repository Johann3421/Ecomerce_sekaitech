'use client'

import { useFilters } from "@/hooks/useFilters"
import { X, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import Button from "@/components/ui/Button"

interface FilterSidebarProps {
  categories: { name: string; slug: string }[]
  colors: string[]
  sizes: string[]
  maxProductPrice: number
}

export default function FilterSidebar({
  categories,
  colors,
  sizes,
  maxProductPrice,
}: FilterSidebarProps) {
  const { setFilter, clearFilters, getFilter, activeFilterCount } = useFilters()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const selectedCategory = getFilter("category")
  const selectedColor = getFilter("color")
  const selectedSize = getFilter("size")
  const minPrice = getFilter("minPrice")
  const maxPrice = getFilter("maxPrice")

  const colorSwatches: Record<string, string> = {
    Negro: "#000000",
    Blanco: "#FFFFFF",
    Azul: "#3B82F6",
    Rojo: "#EF4444",
    Verde: "#22C55E",
    Camel: "#C4A86B",
    Gris: "#9CA3AF",
    Champagne: "#F7E7CE",
    Cognac: "#9A5B3A",
    Chocolate: "#7B3F00",
    Navy: "#1E3A5F",
    "Azul Medianoche": "#191970",
    Beige: "#F5F5DC",
    "Azul Cielo": "#87CEEB",
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-ink-primary mb-3">Categorías</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                setFilter("category", selectedCategory === cat.slug ? "" : cat.slug)
              }
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                selectedCategory === cat.slug
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-ink-secondary hover:bg-surface-50 hover:text-ink-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-ink-primary mb-3">Precio</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setFilter("minPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            min={0}
            aria-label="Precio mínimo"
          />
          <span className="text-ink-tertiary">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setFilter("maxPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            max={maxProductPrice}
            aria-label="Precio máximo"
          />
        </div>
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink-primary mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() =>
                  setFilter("color", selectedColor === color ? "" : color)
                }
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  selectedColor === color
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-surface-200 text-ink-secondary hover:border-ink-tertiary"
                }`}
                aria-label={`Color ${color}`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-surface-200"
                  style={{ backgroundColor: colorSwatches[color] || "#ccc" }}
                />
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink-primary mb-3">Talla</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() =>
                  setFilter("size", selectedSize === size ? "" : size)
                }
                className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-surface-200 text-ink-secondary hover:border-ink-tertiary"
                }`}
                aria-label={`Talla ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            clearFilters()
            setIsMobileOpen(false)
          }}
        >
          <X className="w-4 h-4" />
          Limpiar filtros ({activeFilterCount})
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-surface-200 rounded-xl text-sm font-medium text-ink-primary hover:bg-surface-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <FilterContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-modal overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-50"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </>
      )}
    </>
  )
}
