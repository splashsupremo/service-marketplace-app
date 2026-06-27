"use server";

import { adminSupabase } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function toggleVerified(providerId: string, current: boolean) {
  const { error } = await adminSupabase
    .from("providers")
    .update({ is_verified: !current })
    .eq("id", providerId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/providers");
}

export async function toggleFeatured(providerId: string, current: boolean) {
  const { error } = await adminSupabase
    .from("providers")
    .update({ is_featured: !current })
    .eq("id", providerId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/providers");
}