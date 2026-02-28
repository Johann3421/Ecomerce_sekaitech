"use client"

import React from "react"

export default function SortSelect({
  options,
  currentSort,
}: {
  options: { value: string; label: string }[]
  currentSort: string
}) {
  return (
    <form>
      <select
        name="sort"
        id="sort"
        defaultValue={currentSort}
        onChange={(e) => {
          const url = new URL(window.location.href)
          if ((e.target as HTMLSelectElement).value) {
            url.searchParams.set("sort", (e.target as HTMLSelectElement).value)
          } else {
            url.searchParams.delete("sort")
          }
          window.location.href = url.toString()
        }}
        className="px-3 py-2 text-sm border border-surface-200 rounded-xl bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  )
}
