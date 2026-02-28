"use client"

import dynamic from "next/dynamic"

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-brand-50 to-surface-100 animate-pulse rounded-3xl" />
  ),
})

export default function HeroSceneWrapper() {
  return <HeroScene />
}
