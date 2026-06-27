"use server";

import { adminSupabase } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function toggleBanUser(userId: string, isBanned: boolean) {
  const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
    ban_duration: isBanned ? "none" : "876600h", // none = unban, 876600h = 100 years
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/users");
}