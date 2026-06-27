import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { headers } from "next/headers";

// Each page passes its title via a custom header — we read the pathname instead
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <TopBar session={session} title="ServeNaija Admin" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}