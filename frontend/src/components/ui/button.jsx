import * as React from "react"
import { cn } from "@/lib/utils"

export const Button = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 hover:bg-gray-100",
      ghost: "hover:bg-gray-100",
      premium: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
    }
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
