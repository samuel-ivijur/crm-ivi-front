'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormValues, loginSchema } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const { login, loading } = useAuth()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      await login(data.email, data.password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
        <Input 
          id="email"
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <span className="text-red-500 text-sm">{form.formState.errors.email.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">Senha</label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>
        )}
      </div>
      <Button 
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  )
} 