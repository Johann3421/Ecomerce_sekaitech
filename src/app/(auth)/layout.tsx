import { Metadata } from "next"

export const metadata: Metadata = { title: "Autenticación" }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        {children}
      </div>

      {/* Right — Branding panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 to-brand-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative text-center text-white">
          <h2 className="text-4xl font-bold mb-4">LumiStore</h2>
          <p className="text-lg text-white/80 max-w-sm">
            Descubre productos premium con una experiencia de compra única y envolvente.
          </p>
        </div>
      </div>
    </div>
  )
}
