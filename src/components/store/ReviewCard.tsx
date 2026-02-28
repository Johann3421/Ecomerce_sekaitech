import { Star } from "lucide-react"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    title: string | null
    body: string
    verified: boolean
    createdAt: Date
    user: {
      name: string | null
      image: string | null
    }
  }
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-surface-200 pb-6 last:border-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-surface-200 text-surface-200"
                }`}
              />
            ))}
          </div>
          {review.title && (
            <h4 className="text-sm font-semibold text-ink-primary">
              {review.title}
            </h4>
          )}
        </div>
        {review.verified && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Compra verificada
          </span>
        )}
      </div>
      <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
        {review.body}
      </p>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-brand-700">
            {review.user.name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <span className="text-xs font-medium text-ink-secondary">
          {review.user.name || "Anónimo"}
        </span>
        <span className="text-xs text-ink-tertiary">
          · {new Date(review.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}
