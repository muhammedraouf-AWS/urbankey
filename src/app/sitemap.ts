import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { fetchProperties } from "@/features/properties/services"
import { fetchProjects } from "@/features/projects/services"
import { fetchDevelopers } from "@/features/developers/services"
import type { PaginatedResponse } from "@/types/common"

// Safety cap so a runaway WordPress dataset can't blow up the sitemap request.
const MAX_PAGES = 20
const PER_PAGE = 50

async function collectAllSlugs<T extends { slug: string }>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const all: T[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await fetchPage(page)
    all.push(...result.data)
    totalPages = result.pagination.totalPages
    page++
  } while (page <= totalPages && page <= MAX_PAGES)

  return all
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/developers`, changeFrequency: "weekly", priority: 0.6 },
  ]

  const [properties, projects, developers] = await Promise.all([
    collectAllSlugs((page) => fetchProperties({ page, perPage: PER_PAGE })),
    collectAllSlugs((page) => fetchProjects({ page, perPage: PER_PAGE })),
    collectAllSlugs((page) => fetchDevelopers({ page, perPage: PER_PAGE })),
  ])

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${siteConfig.url}/properties/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const developerRoutes: MetadataRoute.Sitemap = developers.map((developer) => ({
    url: `${siteConfig.url}/developers/${developer.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...propertyRoutes, ...projectRoutes, ...developerRoutes]
}
