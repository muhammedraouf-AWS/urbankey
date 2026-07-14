import { apiConfig } from "@/config/api"
import { endpoints } from "@/config/api"
import type { User, WpJwtResponse } from "@/types/auth"
import type { LoginCredentials, RegisterData } from "@/types/auth"

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// WordPress /users/me response (context=edit)
interface WpUserMe {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  roles: string[]
  avatar_urls: Record<string, string>
  registered_date: string
}

function buildApiUrl(path: string): string {
  return `${apiConfig.baseUrl}${apiConfig.wpJsonPath}${path}`
}

async function wpFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = (body as { message?: string } | null)?.message ?? `HTTP ${res.status}`
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export async function login(
  credentials: LoginCredentials
): Promise<{ user: User; token: string; expiresAt: number }> {
  const jwt = await wpFetch<WpJwtResponse>(buildApiUrl(endpoints.auth.login), {
    method: "POST",
    body: JSON.stringify({ username: credentials.email, password: credentials.password }),
  })

  const expiresAt = Date.now() + TOKEN_TTL_MS
  const user = await getMe(jwt.token)

  return { user, token: jwt.token, expiresAt }
}

export async function register(data: RegisterData): Promise<void> {
  await wpFetch(buildApiUrl(endpoints.auth.register), {
    method: "POST",
    body: JSON.stringify({
      email:     data.email,
      password:  data.password,
      firstName: data.firstName,
      lastName:  data.lastName,
    }),
  })
}

export async function getMe(token: string): Promise<User> {
  const data = await wpFetch<WpUserMe>(
    buildApiUrl(endpoints.auth.me) + "?context=edit",
    { headers: { Authorization: `Bearer ${token}` } }
  )

  return {
    id:          data.id,
    email:       data.email,
    firstName:   data.first_name,
    lastName:    data.last_name,
    displayName: data.name,
    avatar:      data.avatar_urls?.["96"] ?? undefined,
    role:        (data.roles?.[0] ?? "subscriber") as User["role"],
    createdAt:   data.registered_date ?? "",
  }
}
