import * as React from "react"
import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function PaperSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2 mt-1" />
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <div className="flex gap-2 w-full">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="flex justify-between w-full mt-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
