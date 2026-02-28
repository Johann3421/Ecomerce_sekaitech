import { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const appName = process.env.NEXT_PUBLIC_APP_NAME || "LumiStore"

export function createMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: appName,
      images: [{ url: image || "/og-default.jpg", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || "/og-default.jpg"],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
