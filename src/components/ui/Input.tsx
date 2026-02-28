import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-ink-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-surface-0 text-ink-primary placeholder:text-ink-tertiary",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
            error
              ? "border-red-400 focus:ring-red-500/30 focus:border-red-500"
              : "border-surface-200 hover:border-surface-200/80",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-ink-tertiary">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input
