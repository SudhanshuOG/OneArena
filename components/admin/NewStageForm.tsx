"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function NewStageForm({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [name, setName] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(1);
  const [pending, start] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await fetch("/api/admin/stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournament_id: tournamentId,
          name,
          order_index: orderIndex,
        }),
      });
      if (res.ok) {
        setName("");
        setOrderIndex(1);
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        alert("Failed: " + (j?.error || "unknown"));
      }
    });
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-end">
      <div>
        <label className="block text-sm">Stage name</label>
        <input
          className="border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="League Stage"
        />
      </div>
      <div>
        <label className="block text-sm">Order</label>
        <input
          type="number"
          className="border px-3 py-2 rounded w-24"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value || "1", 10))}
          min={1}
        />
      </div>
      <button disabled={pending} className="px-3 py-2 border rounded">
        {pending ? "Adding…" : "Add Stage"}
      </button>
    </form>
  );
}
