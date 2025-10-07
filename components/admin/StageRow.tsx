"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Stage = {
  id: string;
  name: string;
  order_index: number;
  deleted_at?: string | null;
};

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

  const softDelete = () =>
    start(async () => {
      if (!confirm("Archive this stage?")) return;
      const res = await fetch(`/api/admin/stages/${stage.id}/archive`, {
        method: "POST",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Archive failed: ${j?.error || res.status}`);
        return;
      }
      router.refresh();
    });

  const restore = () =>
    start(async () => {
      const res = await fetch(`/api/admin/stages/${stage.id}/restore`, {
        method: "POST",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Restore failed: ${j?.error || res.status}`);
        return;
      }
      router.refresh();
    });

  const hardDelete = () =>
    start(async () => {
      if (!confirm("Permanently delete this stage? This cannot be undone."))
        return;
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
          disabled={pending || stage.deleted_at}
        />
        <input
          className="border px-3 py-1 rounded min-w-64"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending || stage.deleted_at}
        />
      </div>

      <div className="flex gap-2">
        {!stage.deleted_at ? (
          <>
            <button
              onClick={save}
              disabled={pending}
              className="border px-2 py-1 rounded text-sm"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={softDelete}
              disabled={pending}
              className="border px-2 py-1 rounded text-sm text-red-500"
            >
              {pending ? "…" : "Archive"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={restore}
              disabled={pending}
              className="border px-2 py-1 rounded text-sm text-green-500"
            >
              {pending ? "…" : "Restore"}
            </button>
            <button
              onClick={hardDelete}
              disabled={pending}
              className="border px-2 py-1 rounded text-sm text-red-500"
            >
              {pending ? "…" : "Delete Forever"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
