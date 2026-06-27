import { SkeletonTable } from "@/components/layout/SkeletonRow";

export default function ProvidersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-7 bg-slate-800 rounded animate-pulse w-28" />
        <div className="h-4 bg-slate-800 rounded animate-pulse w-48" />
      </div>
      <SkeletonTable cols={5} rows={8} />
    </div>
  );
}