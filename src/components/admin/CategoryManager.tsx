"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Category = { id: string; name: string; slug: string; productCount: number };

function CategoryRow({ category, onChanged }: { category: Category; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (name.trim() === category.name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not rename");
      return;
    }
    setEditing(false);
    onChanged();
  }

  async function remove() {
    const warning =
      category.productCount > 0
        ? `"${category.name}" is used by ${category.productCount} product${category.productCount === 1 ? "" : "s"}. Delete it anyway? Those products will just lose this category.`
        : `Delete "${category.name}"?`;
    if (!confirm(warning)) return;
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    if (res.ok) onChanged();
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-border p-3">
      {editing ? (
        <>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 flex-1"
            autoFocus
          />
          <Button size="md" variant="secondary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            size="md"
            variant="ghost"
            onClick={() => {
              setEditing(false);
              setName(category.name);
              setError(null);
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm font-medium text-ink">{category.name}</span>
          <Badge tone="neutral">
            {category.productCount} product{category.productCount === 1 ? "" : "s"}
          </Badge>
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-accent"
          >
            Rename
          </button>
          <button onClick={remove} className="text-sm font-medium text-red-500">
            Delete
          </button>
        </>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    router.refresh();
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not add category");
      return;
    }
    setNewName("");
    refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name (e.g. Tennis)"
          className="flex-1"
        />
        <Button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add"}
        </Button>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} onChanged={refresh} />
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-ink-soft">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
