import { AdminSession } from "@/lib/auth/session";

interface TopBarProps {
  session: AdminSession;
  title: string;
}

export default function TopBar({ session, title }: TopBarProps) {
  const initials = session.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-white font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-white text-sm font-medium">{session.fullName}</p>
          <p className="text-slate-500 text-xs">{session.email}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  );
}