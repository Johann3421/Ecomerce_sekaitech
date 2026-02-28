"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Eye, EyeOff, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Error al registrar. Inténtalo de nuevo.")
        setLoading(false)
        return
      }

      router.push("/login?registered=true")
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold text-brand-500">
          LumiStore
        </Link>
        <h1 className="text-3xl font-bold text-ink-primary mt-6">
          Crear Cuenta
        </h1>
        <p className="text-ink-secondary mt-2">
          Únete a LumiStore y empieza a comprar.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          value={form.name}
          onChange={update("name")}
          placeholder="Tu nombre"
          required
          autoFocus
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="tu@email.com"
          required
        />

        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={update("password")}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-ink-tertiary hover:text-ink-primary transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        <Input
          label="Confirmar contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          placeholder="Repite tu contraseña"
          required
        />

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
