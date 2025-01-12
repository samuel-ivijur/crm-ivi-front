import { authCookies } from '@/utils/auth-cookies'

interface LoginResponse {
  data: {
    token: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  message?: string
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch('https://dash.ivijur.com.br/api/v1/auth/login', {
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

    // Armazenar dados nos cookies do servidor
    authCookies.setAuthData(data.data.token, data.data.user)

    return data
  },

  logout: async () => {
    authCookies.clearAuthData()
  },

  getCurrentUser: async () => {
    const { user, token } = authCookies.getAuthData()
    return { user, token }
  }
} 