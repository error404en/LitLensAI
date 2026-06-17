import { Skeleton } from "../ui/skeleton";
import { HubLayout } from "./HubLayout";

export function LoadingSkeleton() {
  return (
    <HubLayout
      header={
        <div className="p-4 flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      }
      leftSidebar={
        <div className="p-4 space-y-4">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }
      center={
        <div className="space-y-6">
          {/* Overview Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>

          <Skeleton className="h-10 w-48 mt-8" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      }
      rightSidebar={
        <div className="p-4 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      }
      bottom={
        <div className="p-3">
          <Skeleton className="h-6 w-48" />
        </div>
      }
    />
  );
}
