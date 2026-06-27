import { adminSupabase } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getConversationDetail(id: string) {
  // Fetch conversation
  const { data: conv, error } = await adminSupabase
    .from("conversations")
    .select("id, customer_id, provider_id, created_at, last_message_at")
    .eq("id", id)
    .single();

  if (error || !conv) return null;

  // Fetch both profiles
  const { data: profiles } = await adminSupabase
    .from("profiles")
    .select("id, full_name, role")
    .in("id", [conv.customer_id, conv.provider_id]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Fetch all messages
  const { data: messages } = await adminSupabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  return {
    ...conv,
    customer: profileMap.get(conv.customer_id),
    provider: profileMap.get(conv.provider_id),
    messages: messages ?? [],
  };
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conv = await getConversationDetail(id);

  if (!conv) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard/conversations"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Conversations
      </Link>

      {/* Participants */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Participants</h2>
        <div className="flex gap-6">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
              Customer
            </p>
            <p className="text-white font-medium">
              {conv.customer?.full_name ?? "—"}
            </p>
          </div>
          <div className="w-px bg-slate-800" />
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
              Provider
            </p>
            <p className="text-white font-medium">
              {conv.provider?.full_name ?? "—"}
            </p>
          </div>
          <div className="w-px bg-slate-800" />
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
              Started
            </p>
            <p className="text-white font-medium">
              {new Date(conv.created_at).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="w-px bg-slate-800" />
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
              Messages
            </p>
            <p className="text-white font-medium">{conv.messages.length}</p>
          </div>
        </div>
      </div>

      {/* Messages thread */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Message Thread</h2>
        </div>

        {conv.messages.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-12">
            No messages in this conversation yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {conv.messages.map((msg) => {
              const isCustomer = msg.sender_id === conv.customer_id;
              const sender = isCustomer ? conv.customer : conv.provider;

              return (
                <div key={msg.id} className="px-5 py-4 flex gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                      isCustomer
                        ? "bg-emerald-400/20 text-emerald-400"
                        : "bg-violet-400/20 text-violet-400"
                    }`}
                  >
                    {sender?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white text-sm font-medium">
                        {sender?.full_name ?? "Unknown"}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isCustomer
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-violet-400/10 text-violet-400"
                        }`}
                      >
                        {isCustomer ? "customer" : "provider"}
                      </span>
                      <span className="text-slate-500 text-xs ml-auto flex-shrink-0">
                        {new Date(msg.created_at).toLocaleString("en-NG", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}