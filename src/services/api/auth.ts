import { API_URL } from '@/config/api'
import { User } from '@/types/auth'
import { authCookies } from '@/utils/auth-cookies'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data: LoginResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login')
    }

    const { token, ...user } = data.data
    authCookies.setAuthData({ token, user })

    return data
  },

  logout: async () => {
    authCookies.clearAuthData()
  },

  getCurrentUser: () => authCookies.getAuthData()
} 

interface LoginResponse {
  data: User & { token: string }
  message?: string
}