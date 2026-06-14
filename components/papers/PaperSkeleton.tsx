import * as React from "react"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function PaperSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm h-[104px]">
            <div className="flex flex-col gap-2 w-1/2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="flex flex-col h-full h-[320px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-1" />
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="flex-1 pb-4 mt-2">
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-1.5" />
            <Skeleton className="h-4 w-full mb-1.5" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t pt-4">
            <div className="flex gap-2 w-full">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex justify-between w-full mt-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
