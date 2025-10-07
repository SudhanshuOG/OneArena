"use client";
import { useState } from "react";
type Team = { id: string; name: string };
type Row = {
  team_id: string;
  placement: number;
  kills: number;
  points: number;
};

export default function ScoringForm({
  matchId,
  teams,
  initial,
}: {
  matchId: string;
  teams: Team[];
  initial: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initial);
  const addRow = () =>
    setRows((r) => [
      ...r,
      { team_id: teams[0]?.id || "", placement: 0, kills: 0, points: 0 },
    ]);
  const update = (i: number, key: keyof Row, val: any) => {
    const copy = [...rows];
    (copy[i] as any)[key] = key === "team_id" ? val : Number(val || 0);
    setRows(copy);
  };
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  const save = async () => {
    const res = await fetch(`/api/admin/match-results/${matchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results: rows }),
    });
    if (res.ok) alert("Saved ✅");
    else {
      const j = await res.json().catch(() => ({}));
      alert("Save failed: " + (j?.error || res.status));
    }
  };

  return (
    <div className="space-y-3">
      <button onClick={addRow} className="border px-2 py-1 rounded text-sm">
        + Add row
      </button>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_100px_100px_100px_80px] gap-2 items-center"
          >
            <select
              className="border px-2 py-1 rounded"
              value={r.team_id}
              onChange={(e) => update(i, "team_id", e.target.value)}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="border px-2 py-1 rounded"
              value={r.placement}
              onChange={(e) => update(i, "placement", e.target.value)}
              placeholder="Place"
            />
            <input
              type="number"
              className="border px-2 py-1 rounded"
              value={r.kills}
              onChange={(e) => update(i, "kills", e.target.value)}
              placeholder="Kills"
            />
            <input
              type="number"
              className="border px-2 py-1 rounded"
              value={r.points}
              onChange={(e) => update(i, "points", e.target.value)}
              placeholder="Points"
            />
            <button
              onClick={() => remove(i)}
              className="border px-2 py-1 rounded text-sm text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button onClick={save} className="px-3 py-1.5 border rounded">
        Save Results
      </button>
    </div>
  );
}
