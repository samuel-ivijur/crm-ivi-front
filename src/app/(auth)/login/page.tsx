import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { AuthLayout } from '@/components/layouts/auth-layout'

export default function LoginPage() {
  return (
    <AuthLayout
      imageUrl="/dashboard-preview.jpg"
      imageAlt="Dashboard analítico"
    >
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem vindo ao CRM da Ivi
          </h1>
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-[#0146cf] hover:text-[#0146cf]/90">
              Registre-se aqui!
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  )
} 