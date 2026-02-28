import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
}

export default function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded",
    circular: "h-10 w-10 rounded-full",
    rectangular: "h-40 w-full rounded-xl",
  }

  return (
    <div
      className={cn(
        "bg-surface-200 skeleton-pulse",
        variants[variant],
        className
      )}
      aria-hidden="true"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-0 rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-3 w-20" />
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-5 w-1/3" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
