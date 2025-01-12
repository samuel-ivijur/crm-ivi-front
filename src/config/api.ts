export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dash.ivijur.com.br/api/v1'

export const ENDPOINTS = {
  processos: `${API_URL}/processos`,
  clientes: `${API_URL}/clientes`,
  usuarios: `${API_URL}/usuarios`,
  auth: {
    login: `${API_URL}/auth/login`,
    refresh: `${API_URL}/auth/refresh`,
    logout: `${API_URL}/auth/logout`,
  },
} as const 