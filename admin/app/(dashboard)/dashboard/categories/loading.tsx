import { SkeletonTable } from "@/components/layout/SkeletonRow";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-7 bg-slate-800 rounded animate-pulse w-32" />
        <div className="h-4 bg-slate-800 rounded animate-pulse w-44" />
      </div>
      {/* Add form skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="h-5 bg-slate-800 rounded animate-pulse w-36" />
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-slate-800 rounded-lg animate-pulse" />
          <div className="w-44 h-10 bg-slate-800 rounded-lg animate-pulse" />
          <div className="w-24 h-10 bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </div>
      <SkeletonTable cols={3} rows={6} />
    </div>
  );
}