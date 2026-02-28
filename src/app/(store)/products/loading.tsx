import { ProductGridSkeleton } from "@/components/ui/Skeleton"

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-surface-200 rounded-lg w-48 mb-2" />
        <div className="h-4 bg-surface-200 rounded-lg w-32" />
      </div>
      <ProductGridSkeleton />
    </div>
  )
}
