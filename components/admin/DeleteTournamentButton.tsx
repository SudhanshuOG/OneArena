"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTournamentButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      className="text-red-500 text-sm border px-2 py-1 rounded"
      disabled={pending}
      onClick={() =>
        start(async () => {
          if (!confirm("Delete this tournament?")) return;
          const res = await fetch(`/api/admin/tournaments/${id}`, {
            method: "DELETE",
          });
          if (res.ok) router.refresh();
          else alert("Delete failed");
        })
      }
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
