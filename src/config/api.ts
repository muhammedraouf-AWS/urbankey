export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  wpJsonPath: "/wp-json",
  namespace: "urbankey/v1",
  timeout: 10_000,
} as const

const base = apiConfig.namespace

export const endpoints = {
  properties: {
    list: `/${base}/properties`,
    single: (slug: string) => `/${base}/properties/${slug}`,
    featured: `/${base}/properties?featured=true`,
  },
  agents: {
    list: `/${base}/agents`,
    single: (slug: string) => `/${base}/agents/${slug}`,
  },
  projects: {
    list: `/${base}/projects`,
    single: (slug: string) => `/${base}/projects/${slug}`,
  },
  developers: {
    list: `/${base}/developers`,
    single: (slug: string) => `/${base}/developers/${slug}`,
  },
  search: `/${base}/search`,
  auth: {
    login:    `/jwt-auth/v1/token`,
    refresh:  `/jwt-auth/v1/token/refresh`,
    validate: `/jwt-auth/v1/token/validate`,
    register: `/${base}/register`,
    me:       `/wp/v2/users/me`,
  },
  blog: {
    list: `/wp/v2/posts`,
    single: (slug: string) => `/wp/v2/posts?slug=${slug}`,
    categories: `/wp/v2/categories`,
  },
} as const
