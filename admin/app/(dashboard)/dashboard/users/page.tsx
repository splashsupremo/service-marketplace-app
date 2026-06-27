import { adminSupabase } from "@/lib/supabase/admin";
import UserActions from "./UserActions";
import { UserCheck, Store } from "lucide-react";

export const metadata = { title: "Users · ServeNaija Admin" };

async function getUsers() {
  const { data: profilesData, error } = await adminSupabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }

  // Fetch auth users to get emails + ban status
  const { data: authData } = await adminSupabase.auth.admin.listUsers();
  const authMap = new Map(
    authData?.users?.map((u) => [
      u.id,
      {
        email: u.email ?? "—",
        banned: u.banned_until
          ? new Date(u.banned_until) > new Date()
          : false,
      },
    ]) ?? []
  );

  return (profilesData ?? []).map((profile) => ({
    ...profile,
    email: authMap.get(profile.id)?.email ?? "—",
    isBanned: authMap.get(profile.id)?.banned ?? false,
  }));
}

export default async function UsersPage() {
  const users = await getUsers();
  const customers = users.filter((u) => u.role === "customer");
  const providers = users.filter((u) => u.role === "provider");
  const banned = users.filter((u) => u.isBanned);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-2xl font-bold">Users</h2>
          <p className="text-slate-400 text-sm mt-1">
            {users.length} total accounts
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
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
          {banned.length > 0 && (
            <div className="bg-slate-900 border border-red-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-400 text-sm">
                {banned.length} banned
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-6 py-3">Name</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Email</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Role</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Joined</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Status</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-slate-500 py-12">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    i === users.length - 1 ? "border-b-0" : ""
                  } ${user.isBanned ? "opacity-60" : ""}`}
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
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                        Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <UserActions
                      userId={user.id}
                      isBanned={user.isBanned}
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