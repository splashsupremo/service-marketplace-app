"use client";

import { useState } from "react";
import { addCategory, deleteCategory } from "./actions";
import { Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd() {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setError("");
    setAdding(true);
    try {
      await addCategory(name, icon);
      setName("");
      setIcon("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add category");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Add New Category</h3>
        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name (e.g. Plumbing)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Icon name (optional)"
            className="w-44 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      {/* Categories list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-6 py-3">Name</th>
              <th className="text-left text-slate-400 font-medium px-6 py-3">Icon</th>
              <th className="text-right text-slate-400 font-medium px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-slate-500 py-12">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    i === categories.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-white font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-slate-400">{cat.icon || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deletingId === cat.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50 ml-auto"
                    >
                      <Trash2 size={13} />
                      {deletingId === cat.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}