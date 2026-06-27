import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { headers } from "next/headers";

function getTitleFromPath(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/dashboard/users")) return "Users";
  if (pathname.startsWith("/dashboard/providers")) return "Providers";
  if (pathname.startsWith("/dashboard/categories")) return "Categories";
  if (pathname.startsWith("/dashboard/conversations")) return "Conversations";
  return "Dashboard";
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") ?? 
                   headersList.get("next-url") ?? 
                   "/dashboard";
  const title = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <TopBar session={session} title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}