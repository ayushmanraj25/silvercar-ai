import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"
