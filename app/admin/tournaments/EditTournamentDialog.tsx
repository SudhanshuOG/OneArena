"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateTournament } from "./actions";

type Game = { id: string; name: string };
type Tournament = {
  id: string;
  name: string;
  slug: string;
  status: "upcoming" | "ongoing" | "completed";
  start_date: string | null;
  end_date: string | null;
  game_id: string;
};

export default function EditTournamentDialog({
  tournament,
  games,
}: {
  tournament: Tournament;
  games: Game[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: tournament.name ?? "",
    slug: tournament.slug ?? "",
    status: tournament.status ?? "upcoming",
    start_date: (tournament.start_date ?? "").slice(0, 10), // yyyy-mm-dd
    end_date: (tournament.end_date ?? "").slice(0, 10),
    game_id: tournament.game_id ?? "",
  });

  function onChange<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateTournament(tournament.id, {
        ...form,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      if (res?.error) {
        alert(res.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        className="text-sm border px-2 py-1 rounded"
        onClick={() => setOpen(true)}
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded border bg-black p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Edit Tournament</h3>
              <button
                className="text-sm border px-2 py-1 rounded"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Name</span>
                <input
                  className="border rounded px-2 py-1 bg-transparent"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  required
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm">Slug</span>
                <input
                  className="border rounded px-2 py-1 bg-transparent"
                  value={form.slug}
                  onChange={(e) => onChange("slug", e.target.value)}
                  required
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm">Game</span>
                <select
                  className="border rounded px-2 py-1 bg-transparent"
                  value={form.game_id}
                  onChange={(e) => onChange("game_id", e.target.value)}
                  required
                >
                  <option value="">Select game</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm">Status</span>
                <select
                  className="border rounded px-2 py-1 bg-transparent"
                  value={form.status}
                  onChange={(e) =>
                    onChange("status", e.target.value as Tournament["status"])
                  }
                >
                  <option value="upcoming">upcoming</option>
                  <option value="ongoing">ongoing</option>
                  <option value="completed">completed</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-sm">Start date</span>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 bg-transparent"
                    value={form.start_date || ""}
                    onChange={(e) => onChange("start_date", e.target.value)}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm">End date</span>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 bg-transparent"
                    value={form.end_date || ""}
                    onChange={(e) => onChange("end_date", e.target.value)}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="border px-3 py-1 rounded"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="border px-3 py-1 rounded"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
