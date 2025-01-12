import { cn } from "@/utils/cn"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'warning' | 'destructive' | 'success'
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary/80 text-primary-foreground hover:bg-primary/60": variant === "default",
          "border-border bg-background hover:bg-accent": variant === "outline",
          "bg-warning/80 text-warning-foreground hover:bg-warning/60": variant === "warning",
          "bg-destructive/80 text-destructive-foreground hover:bg-destructive/60": variant === "destructive",
          "bg-green-100 text-green-800 hover:bg-green-100/80": variant === "success",
        },
        className
      )}
      {...props}
    />
  )
} 