import { adminSupabase } from "@/lib/supabase/admin";
import { AnalyticsData } from "@/lib/types";
import {
  Users,
  Store,
  MessageSquare,
  Star,
  MessageCircle,
  CheckCircle,
  Sparkles,
  UserCheck,
} from "lucide-react";

async function getAnalytics(): Promise<AnalyticsData> {
  const [
    { count: totalUsers },
    { count: totalProviders },
    { count: totalCustomers },
    { count: totalMessages },
    { count: totalReviews },
    { count: totalConversations },
    { count: verifiedProviders },
    { count: featuredProviders },
  ] = await Promise.all([
    adminSupabase.from("profiles").select("*", { count: "exact", head: true }),
    adminSupabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "provider"),
    adminSupabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    adminSupabase.from("messages").select("*", { count: "exact", head: true }),
    adminSupabase.from("reviews").select("*", { count: "exact", head: true }),
    adminSupabase
      .from("conversations")
      .select("*", { count: "exact", head: true }),
    adminSupabase
      .from("providers")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true),
    adminSupabase
      .from("providers")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalProviders: totalProviders ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalMessages: totalMessages ?? 0,
    totalReviews: totalReviews ?? 0,
    totalConversations: totalConversations ?? 0,
    verifiedProviders: verifiedProviders ?? 0,
    featuredProviders: featuredProviders ?? 0,
  };
}

const STAT_CARDS = (data: AnalyticsData) => [
  {
    label: "Total Users",
    value: data.totalUsers,
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Customers",
    value: data.totalCustomers,
    icon: UserCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Providers",
    value: data.totalProviders,
    icon: Store,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    label: "Verified Providers",
    value: data.verifiedProviders,
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    label: "Featured Providers",
    value: data.featuredProviders,
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    label: "Conversations",
    value: data.totalConversations,
    icon: MessageSquare,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    label: "Messages Sent",
    value: data.totalMessages,
    icon: MessageCircle,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    label: "Reviews",
    value: data.totalReviews,
    icon: Star,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

export default async function DashboardOverviewPage() {
  const analytics = await getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Overview</h2>
        <p className="text-slate-400 text-sm mt-1">
          Live platform statistics from ServeNaija.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS(analytics).map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4"
          >
            <div className={`${bg} p-2.5 rounded-lg flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">{label}</p>
              <p className="text-white text-2xl font-bold mt-0.5">
                {value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}