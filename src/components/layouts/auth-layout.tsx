'use client'

import Image from 'next/image'

interface AuthLayoutProps {
  children: React.ReactNode
  imageUrl: string
  imageAlt: string
}

export function AuthLayout({ children, imageUrl, imageAlt }: AuthLayoutProps) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-white">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={1920}
            height={1080}
            className="object-contain w-full h-full p-8"
          />
        </div>
      </div>
      <div className="lg:p-8">
        {children}
      </div>
    </div>
  )
} 