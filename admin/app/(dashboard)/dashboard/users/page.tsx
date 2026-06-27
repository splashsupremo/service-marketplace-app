import { adminSupabase } from "@/lib/supabase/admin";
import { AdminUser } from "@/lib/types";
import { Users, UserCheck, Store } from "lucide-react";

async function getUsers(): Promise<AdminUser[]> {
  const { data, error } = await adminSupabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }

  // Fetch emails from auth.users via admin API
  const { data: authData } = await adminSupabase.auth.admin.listUsers();
  const emailMap = new Map(
    authData?.users?.map((u) => [u.id, u.email ?? ""]) ?? []
  );

  return (data ?? []).map((profile) => ({
    ...profile,
    email: emailMap.get(profile.id) ?? "—",
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  const customers = users.filter((u) => u.role === "customer");
  const providers = users.filter((u) => u.role === "provider");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Users</h2>
          <p className="text-slate-400 text-sm mt-1">
            {users.length} total accounts
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <UserCheck size={15} className="text-emerald-400" />
            <span className="text-slate-300 text-sm">
              {customers.length} customers
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <Store size={15} className="text-violet-400" />
            <span className="text-slate-300 text-sm">
              {providers.length} providers
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-6 py-3">
                Name
              </th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">
                Email
              </th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">
                Role
              </th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-slate-500 py-12"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    i === users.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-300 text-xs font-medium">
                          {user.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <span className="text-white font-medium">
                        {user.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "provider"
                          ? "bg-violet-400/10 text-violet-400"
                          : "bg-emerald-400/10 text-emerald-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(user.created_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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