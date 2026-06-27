import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-slate-500 text-8xl font-bold">404</p>
        <h1 className="text-white text-2xl font-semibold">Page not found</h1>
        <p className="text-slate-400 text-sm">
          This page doesn't exist or you don't have access to it.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors mt-2"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}