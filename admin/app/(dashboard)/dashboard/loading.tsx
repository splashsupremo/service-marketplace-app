import { SkeletonStatCards } from "@/components/layout/SkeletonRow";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-7 bg-slate-800 rounded animate-pulse w-32" />
        <div className="h-4 bg-slate-800 rounded animate-pulse w-56" />
      </div>
      <SkeletonStatCards />
    </div>
  );
}