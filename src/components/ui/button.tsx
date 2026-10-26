import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
    
    const variants = {
      default: "bg-[#E50914] text-[#FAFAFA] hover:bg-[#B91C1C] shadow-sm",
      destructive: "bg-[#EF4444] text-[#FAFAFA] hover:bg-[#DC2626] shadow-sm",
      outline: "border border-[#303036] bg-transparent text-[#FAFAFA] hover:bg-[#27272A] hover:text-[#FAFAFA]",
      secondary: "bg-[#27272A] text-[#FAFAFA] hover:bg-[#3F3F46]",
      ghost: "hover:bg-[#27272A] hover:text-[#FAFAFA]",
      link: "text-[#E50914] underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
