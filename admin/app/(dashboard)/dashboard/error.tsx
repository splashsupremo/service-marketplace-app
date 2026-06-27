"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <div className="bg-red-400/10 p-4 rounded-full">
        <AlertTriangle size={32} className="text-red-400" />
      </div>
      <div className="text-center">
        <h2 className="text-white font-semibold text-lg">Something went wrong</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-sm">
          {error.message ?? "An unexpected error occurred loading this page."}
        </p>
      </div>
      <button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}