import { apiConfig } from "@/config/api"
import { parseError } from "@/lib/utils"

type RequestParams = Record<string, string | number | boolean | undefined>

interface FetchOptions extends RequestInit {
  params?: RequestParams
  token?: string
  revalidate?: number | false
}

function buildUrl(path: string, params?: RequestParams): string {
  const url = new URL(`${apiConfig.baseUrl}${apiConfig.wpJsonPath}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }
  return url.toString()
}

function authHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      (body as { message?: string } | null)?.message ?? `HTTP ${response.status}`
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export const apiClient = {
  async get<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { params, token, revalidate, ...init } = options
    try {
      const response = await fetch(buildUrl(path, params), {
        method: "GET",
        headers: { "Content-Type": "application/json", ...authHeaders(token), ...init.headers },
        next: revalidate !== undefined ? { revalidate } : { revalidate: 60 },
        ...init,
      })
      return handleResponse<T>(response)
    } catch (error) {
      throw new Error(`GET ${path} failed: ${parseError(error)}`)
    }
  },

  async post<T>(path: string, body: unknown, options: FetchOptions = {}): Promise<T> {
    const { token, ...init } = options
    try {
      const response = await fetch(buildUrl(path), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token), ...init.headers },
        body: JSON.stringify(body),
        ...init,
      })
      return handleResponse<T>(response)
    } catch (error) {
      throw new Error(`POST ${path} failed: ${parseError(error)}`)
    }
  },

  async put<T>(path: string, body: unknown, options: FetchOptions = {}): Promise<T> {
    const { token, ...init } = options
    try {
      const response = await fetch(buildUrl(path), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(token), ...init.headers },
        body: JSON.stringify(body),
        ...init,
      })
      return handleResponse<T>(response)
    } catch (error) {
      throw new Error(`PUT ${path} failed: ${parseError(error)}`)
    }
  },

  async delete<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...init } = options
    try {
      const response = await fetch(buildUrl(path), {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders(token), ...init.headers },
        ...init,
      })
      return handleResponse<T>(response)
    } catch (error) {
      throw new Error(`DELETE ${path} failed: ${parseError(error)}`)
    }
  },
}
