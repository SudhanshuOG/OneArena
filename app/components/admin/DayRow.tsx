"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DayRow({ day }: { day: any }) {
  const [title, setTitle] = useState(day.title || "");
  const [date, setDate] = useState(day.date ? day.date.split("T")[0] : "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/days/${day.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date }),
    });
    setSaving(false);
    if (!res.ok) return alert("Save failed");
    router.refresh();
  }

  async function del() {
    if (!confirm("Delete this day?")) return;
    const res = await fetch(`/api/admin/days/${day.id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed");
    router.refresh();
  }

  return (
    <li className="p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <input
          className="border px-3 py-1 rounded w-40"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="YYYY-MM-DD"
        />
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
