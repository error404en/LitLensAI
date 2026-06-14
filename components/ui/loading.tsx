import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  text?: string
}

export function Loading({ className, size = "default", text, ...props }: LoadingProps) {
  const iconSize = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center space-y-4 p-8", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", iconSize[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}
