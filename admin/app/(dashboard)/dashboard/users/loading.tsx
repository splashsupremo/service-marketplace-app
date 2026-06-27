import { SkeletonTable } from "@/components/layout/SkeletonRow";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-7 bg-slate-800 rounded animate-pulse w-24" />
        <div className="h-4 bg-slate-800 rounded animate-pulse w-40" />
      </div>
      <SkeletonTable cols={4} rows={8} />
    </div>
  );
}