import * as React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

export function UploadSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Dropzone skeleton */}
      <div className="rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Queue skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
