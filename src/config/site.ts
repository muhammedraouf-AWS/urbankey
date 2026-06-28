export const siteConfig = {
  name: "UrbanKey",
  tagline: "Find Your Perfect Property",
  description:
    "Premium real estate platform connecting buyers, sellers, and agents for a seamless property experience.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/images/og.jpg",
  links: {
    twitter: "https://twitter.com/urbankey",
    instagram: "https://instagram.com/urbankey",
    linkedin: "https://linkedin.com/company/urbankey",
  },
} as const

export type SiteConfig = typeof siteConfig
