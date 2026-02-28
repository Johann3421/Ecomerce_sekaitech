'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/cart"
import SearchBar from "./SearchBar"
import CartDrawer from "./CartDrawer"

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/products" },
  { name: "Ofertas", href: "/products?sort=price_asc" },
]

interface NavbarProps {
  categories?: { name: string; slug: string }[]
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-surface-200/50"
            : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" aria-label="LumiStore Home">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.8" />
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-ink-primary">
                Lumi<span className="text-brand-500">Store</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors rounded-lg hover:bg-surface-50"
                >
                  {link.name}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors rounded-lg hover:bg-surface-50"
                  aria-label="Categorías"
                >
                  Categorías
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                </button>
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-card-hover border border-surface-200 py-2 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-50 transition-colors"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-50 transition-all duration-200 md:hidden"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="hidden md:block">
                <SearchBar />
              </div>

              <Link
                href="/account"
                className="p-2.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-50 transition-all duration-200"
                aria-label="Mi cuenta"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                className="p-2.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-50 transition-all duration-200 hidden sm:block"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-50 transition-all duration-200"
                aria-label={`Carrito con ${totalItems} productos`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-50 transition-all duration-200 md:hidden"
                aria-label="Menú"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="md:hidden pb-3">
              <SearchBar />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 md:hidden shadow-modal overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold">Menú</span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-50"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-ink-secondary hover:text-ink-primary hover:bg-surface-50 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-2 pb-1 px-4 text-xs font-semibold text-ink-tertiary uppercase tracking-wider">
                  Categorías
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-ink-secondary hover:text-ink-primary hover:bg-surface-50 rounded-xl transition-colors pl-8"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-surface-200 space-y-1">
                <Link
                  href="/account"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-ink-secondary hover:text-ink-primary hover:bg-surface-50 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5" /> Mi Cuenta
                </Link>
                <button className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-ink-secondary hover:text-ink-primary hover:bg-surface-50 rounded-xl transition-colors">
                  <Heart className="w-5 h-5" /> Favoritos
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
