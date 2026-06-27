import { adminSupabase } from "@/lib/supabase/admin";
export const metadata = { title: "Conversations · ServeNaija Admin" };
import Link from "next/link";

async function getConversations() {
  // Fetch conversations
  const { data: convs, error } = await adminSupabase
    .from("conversations")
    .select("id, customer_id, provider_id, last_message_at, created_at")
    .order("last_message_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to fetch conversations:", error);
    return [];
  }

  if (!convs || convs.length === 0) return [];

  // Collect all unique user IDs
  const userIds = [
    ...new Set([
      ...convs.map((c) => c.customer_id),
      ...convs.map((c) => c.provider_id),
    ]),
  ];

  // Fetch all relevant profiles in one query
  const { data: profiles } = await adminSupabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name])
  );

  return convs.map((conv) => ({
    ...conv,
    customer_name: profileMap.get(conv.customer_id) ?? "—",
    provider_name: profileMap.get(conv.provider_id) ?? "—",
  }));
}

export default async function ConversationsPage() {
  const conversations = await getConversations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Conversations</h2>
        <p className="text-slate-400 text-sm mt-1">
          {conversations.length} conversations (most recent first)
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-6 py-3">Customer</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Provider</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Last Activity</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Started</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Thread</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv, i) => (
              <tr
                key={conv.id}
                className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                  i === conversations.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-white font-medium">
                  {conv.customer_name}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {conv.provider_name}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {conv.last_message_at
                    ? new Date(conv.last_message_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(conv.created_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/conversations/${conv.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors w-fit"
                  >
                    View thread →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}