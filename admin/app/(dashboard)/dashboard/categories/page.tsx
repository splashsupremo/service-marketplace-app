import { adminSupabase } from "@/lib/supabase/admin";
import CategoryManager from "./CategoryManager";
export const metadata = { title: "Categories · ServeNaija Admin" };

async function getCategories() {
  const { data, error } = await adminSupabase
    .from("categories")
    .select("id, name, icon")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  return data ?? [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Categories</h2>
        <p className="text-slate-400 text-sm mt-1">
          {categories.length} categories · add or remove service categories
        </p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}