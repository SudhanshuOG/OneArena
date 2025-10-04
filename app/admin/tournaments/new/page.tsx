"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Game = { id: string; name: string };

export default function NewTournament() {
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<"planned" | "live" | "completed">(
    "planned"
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/games/list");
        const data: Game[] = await res.json();
        setGames(data || []);
      } catch {
        setGames([]);
      }
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: gameId,
          name,
          slug,
          start_date: start || null,
          end_date: end || null,
          status,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert("Failed to create: " + (j?.error || res.status));
      } else {
        router.push("/admin/tournaments");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-semibold">New Tournament</h1>

      <div>
        <label className="block text-sm">Game</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select game
          </option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Name</label>
        <input
          className="border px-3 py-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm">Slug</label>
        <input
          className="border px-3 py-2 rounded w-full"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Start date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">End date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm">Status</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="planned">planned</option>
          <option value="live">live</option>
          <option value="completed">completed</option>
        </select>
      </div>

      <button disabled={loading} className="px-3 py-2 border rounded">
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
