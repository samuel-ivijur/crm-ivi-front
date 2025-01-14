import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um e-mail válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export type Permission = {
  id: number
  value: string
}

export type Organization = {
  id: string
  name: string
}

export type User = {
  id: string
  name: string
  email: string
  permissions: Permission
  organizations: Organization[]
}

export type AuthState = {
  user: User | null
  loading: boolean
} 