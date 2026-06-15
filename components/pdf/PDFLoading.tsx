import * as React from "react";
import { Skeleton } from "../ui/skeleton";

export function PDFLoading() {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-7 w-12 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      {/* Content skeleton */}
      <div className="flex-1 flex">
        <div className="w-64 border-r p-4 space-y-3 hidden lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded" />
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <Skeleton className="w-[400px] h-[560px] rounded-sm" />
        </div>
      </div>
    </div>
  );
}
