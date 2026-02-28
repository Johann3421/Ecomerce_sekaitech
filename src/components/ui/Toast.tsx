'use client'

import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { useState, useEffect, createContext, useContext, useCallback } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [toast, onRemove])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card min-w-[300px] max-w-md",
        "animate-in slide-in-from-right-full duration-300",
        bgColors[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-ink-primary">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 rounded hover:bg-black/5 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4 text-ink-tertiary" />
      </button>
    </div>
  )
}
