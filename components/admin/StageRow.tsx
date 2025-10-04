"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Stage = { id: string; name: string; order_index: number };

export default function StageRow({ stage }: { stage: Stage }) {
  const [name, setName] = useState(stage.name);
  const [orderIdx, setOrderIdx] = useState<number>(stage.order_index);
  const [pending, start] = useTransition();
  const router = useRouter();

  const save = () =>
    start(async () => {
      const res = await fetch(`/api/admin/stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, order_index: orderIdx }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Save failed: ${j?.error || res.status}`);
        return;
      }
      router.refresh();
    });

  const del = () =>
    start(async () => {
      if (!confirm("Delete this stage?")) return;
      const res = await fetch(`/api/admin/stages/${stage.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Delete failed: ${j?.error || res.status}`);
        return;
      }
      router.refresh();
    });

  return (
    <li className="p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <input
          type="number"
          className="border px-2 py-1 rounded w-20"
          value={orderIdx}
          onChange={(e) => setOrderIdx(parseInt(e.target.value || "1", 10))}
          min={1}
        />
        <input
          className="border px-3 py-1 rounded min-w-64"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={pending}
          className="border px-2 py-1 rounded text-sm"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={del}
          disabled={pending}
          className="border px-2 py-1 rounded text-sm text-red-500"
        >
          {pending ? "…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
