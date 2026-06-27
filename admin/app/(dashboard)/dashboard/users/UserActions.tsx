"use client";

import { useState } from "react";
import { toggleBanUser } from "./actions";
import { Ban, CheckCircle } from "lucide-react";

interface Props {
  userId: string;
  isBanned: boolean;
}

export default function UserActions({ userId, isBanned }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (
      !confirm(
        isBanned
          ? "Unban this user? They will regain access to the app."
          : "Ban this user? They will be immediately signed out and blocked."
      )
    )
      return;

    setLoading(true);
    try {
      await toggleBanUser(userId, isBanned);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
        isBanned
          ? "bg-green-400/10 text-green-400 hover:bg-green-400/20"
          : "bg-red-400/10 text-red-400 hover:bg-red-400/20"
      }`}
    >
      {isBanned ? <CheckCircle size={13} /> : <Ban size={13} />}
      {loading ? "…" : isBanned ? "Unban" : "Ban"}
    </button>
  );
}