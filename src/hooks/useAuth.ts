'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/api/auth'
import { User } from '@/types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { user } = await authService.getCurrentUser()
      setUser(user)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      setUser(response.data.user)
      router.push('/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    loading,
    login,
    logout,
  }
} 