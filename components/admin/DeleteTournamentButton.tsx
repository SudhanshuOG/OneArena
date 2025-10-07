"use client";

import { useTransition } from "react";
import { softDeleteTournament } from "@/app/admin/tournaments/actions";

export default function DeleteTournamentButton({ id }: { id: string }) {
  const [isPending, start] = useTransition();

  return (
    <button
      className="text-sm border border-red-500 text-red-500 px-2 py-1 rounded"
      onClick={() => {
        if (!confirm("Archive this tournament? You can restore it later."))
          return;
        start(async () => {
          const res = await softDeleteTournament(id);
          if (res?.error) alert(res.error);
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
