"use server";

import { adminSupabase } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addCategory(name: string, icon: string) {
  if (!name.trim()) throw new Error("Category name is required");

  const { error } = await adminSupabase
    .from("categories")
    .insert({ name: name.trim(), icon: icon.trim() || "tag" });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  const { error } = await adminSupabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/categories");
}