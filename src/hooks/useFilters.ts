'use client'

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete("page") // Reset page on filter change
      return params.toString()
    },
    [searchParams]
  )

  const setFilter = useCallback(
    (name: string, value: string) => {
      router.push(pathname + "?" + createQueryString(name, value))
    },
    [router, pathname, createQueryString]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const getFilter = useCallback(
    (name: string) => searchParams.get(name) || "",
    [searchParams]
  )

  const activeFilterCount = Array.from(searchParams.entries()).filter(
    ([key]) => !["page", "sort"].includes(key) && searchParams.get(key)
  ).length

  return {
    setFilter,
    clearFilters,
    getFilter,
    activeFilterCount,
    searchParams,
  }
}
