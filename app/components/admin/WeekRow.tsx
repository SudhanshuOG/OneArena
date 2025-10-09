"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function WeekRow({ week }: { week: any }) {
  const [title, setTitle] = useState(week.title || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/weeks/${week.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setSaving(false);
    if (!res.ok) return alert("Save failed");
    router.refresh();
  }

  async function del() {
    if (!confirm("Delete this week and its days?")) return;
    const res = await fetch(`/api/admin/weeks/${week.id}`, {
      method: "DELETE",
    });
    if (!res.ok) return alert("Delete failed");
    router.refresh();
  }

  return (
    <li className="p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <input
          className="border px-3 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="border px-3 py-1 rounded">
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={del} className="border px-3 py-1 rounded text-red-500">
          Delete
        </button>
      </div>
    </li>
  );
}
