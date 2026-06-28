export type UserRole = "subscriber" | "agent" | "developer" | "editor" | "admin"

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  displayName: string
  avatar?: string
  role: UserRole
  createdAt: string
}

export interface AuthTokens {
  token: string
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
}

export interface WpJwtResponse {
  token: string
  user_email: string
  user_nicename: string
  user_display_name: string
}
