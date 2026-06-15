import { UploadSkeleton } from "../../../components/upload/UploadSkeleton";

export default function UploadLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6 max-w-[1400px] mx-auto w-full">
      <div className="mb-2">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-80 bg-muted rounded animate-pulse mt-2" />
      </div>
      <UploadSkeleton />
    </div>
  );
}
