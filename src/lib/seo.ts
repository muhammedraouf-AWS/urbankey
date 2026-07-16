import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"

/**
 * Page-level `openGraph`/`twitter` metadata fully replaces the parent's object
 * rather than merging field-by-field, so any page that overrides either must
 * re-include the default image or it silently disappears.
 */
export function defaultOgImages() {
  return [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }]
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl(siteConfig.ogImage),
    sameAs: Object.values(siteConfig.links),
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
