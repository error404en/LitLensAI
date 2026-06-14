import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onRetry?: () => void
  action?: React.ReactNode
}

export function ErrorState({
  title = "Something went wrong",
  description = "There was an error loading this content. Please try again.",
  onRetry,
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <AlertCircle className="mb-4 h-10 w-10 opacity-80" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-destructive">{title}</h3>
      <p className="mt-2 mb-4 text-sm opacity-80 max-w-sm mx-auto">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
        >
          Try again
        </button>
      )}
      {action && !onRetry && <div className="mt-4">{action}</div>}
    </div>
  )
}
