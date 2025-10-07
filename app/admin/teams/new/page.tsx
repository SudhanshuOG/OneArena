"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Game = { id: string; name: string };

export default function NewTeam() {
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/games/list")
      .then((r) => r.json())
      .then(setGames);
  }, []);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/admin/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game_id: gameId,
            name,
            short_name: shortName,
          }),
        });
        if (res.ok) router.push("/admin/teams");
        else alert("Failed to create");
      }}
    >
      <h1 className="text-2xl font-semibold">New Team</h1>
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
        <label className="block text-sm">Short name (optional)</label>
        <input
          className="border px-3 py-2 rounded w-full"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
        />
      </div>
      <button className="px-3 py-2 border rounded">Save</button>
    </form>
  );
}
