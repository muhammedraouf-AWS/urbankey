import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

interface BuildMetadataOptions {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const ogImage = image.startsWith("http") ? image : `${siteConfig.url}${image}`

  return {
    title,
    description,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}
