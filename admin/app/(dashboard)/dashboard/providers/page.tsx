import { adminSupabase } from "@/lib/supabase/admin";
import { AdminProvider } from "@/lib/types";
import ProviderActions from "./ProviderActions";
import { Star } from "lucide-react";
export const metadata = { title: "Providers · ServeNaija Admin" };

async function getProviders(): Promise<AdminProvider[]> {
  const { data, error } = await adminSupabase
    .from("providers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch providers:", error);
    return [];
  }

  return data ?? [];
}

export default async function ProvidersPage() {
  const providers = await getProviders();
  const verified = providers.filter((p) => p.is_verified).length;
  const featured = providers.filter((p) => p.is_featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Providers</h2>
          <p className="text-slate-400 text-sm mt-1">
            {providers.length} total · {verified} verified · {featured} featured
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-6 py-3">Business</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Category</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Location</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Rating</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-500 py-12">
                  No providers found.
                </td>
              </tr>
            ) : (
              providers.map((provider, i) => (
                <tr
                  key={provider.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    i === providers.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      {provider.business_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {provider.category}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {provider.city}, {provider.state}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-white">
                        {provider.rating?.toFixed(1) ?? "—"}
                      </span>
                      <span className="text-slate-500 text-xs">
                        ({provider.review_count})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ProviderActions
                      providerId={provider.id}
                      isVerified={provider.is_verified}
                      isFeatured={provider.is_featured}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}