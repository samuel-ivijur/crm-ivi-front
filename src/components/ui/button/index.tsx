import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'link' | 'outline' | 'ghost'
  isLoading?: boolean
  size?: 'default' | 'icon' | 'sm'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          variant === 'default' && 'bg-[#0146cf] text-white hover:bg-[#0146cf]/90',
          variant === 'link' && 'text-[#0146cf] hover:underline h-auto p-0',
          variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'icon' && 'h-10 w-10',
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button' 