import * as React from "react"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function ProjectSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm h-[104px]">
            <div className="flex flex-col gap-2 w-1/2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-full max-w-sm" />
              <Skeleton className="h-4 w-2/3 max-w-md" />
            </div>
            <div className="hidden md:flex flex-col gap-1.5 w-32 shrink-0 px-4">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-6" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="hidden lg:block h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col h-full h-[280px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="flex-1 pb-4 mt-2 flex flex-col justify-end">
            <Skeleton className="h-4 w-full mb-1.5" />
            <Skeleton className="h-4 w-4/5 mb-8" />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-4">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5 w-8" />
            </div>
            <Skeleton className="h-3 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
