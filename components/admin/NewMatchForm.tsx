"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Stage = { id: string; name: string };
type DayRow = {
  id: string;
  stage_id: string;
  day_date: string;
  week_name?: string;
};

export default function NewMatchForm({
  tournamentId,
  stages,
  days,
}: {
  tournamentId: string;
  stages: Stage[];
  days: DayRow[];
}) {
  const router = useRouter();

  const [stageId, setStageId] = useState<string>("");
  const [dayId, setDayId] = useState<string>("");
  const [matchNo, setMatchNo] = useState<number>(1);
  const [scheduledAt, setScheduledAt] = useState<string>(""); // date only (YYYY-MM-DD)
  const [status, setStatus] = useState<string>("planned");

  // Days filtered by selected stage
  const filteredDays = useMemo(
    () => days.filter((d) => d.stage_id === stageId),
    [days, stageId]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stage_id: stageId,
        day_id: dayId || null, // optional
        match_no: matchNo,
        scheduled_at: scheduledAt || null, // date only
        status,
      }),
    });

    if (res.ok) {
      router.push(`/admin/tournaments/${tournamentId}/matches`);
    } else {
      const j = await res.json().catch(() => ({}));
      alert("Failed to create: " + (j?.error || res.status));
    }
  };

  return (
    <form className="space-y-4 max-w-md" onSubmit={onSubmit}>
      <h1 className="text-2xl font-semibold">New Match</h1>

      {/* Stage */}
      <div>
        <label className="block text-sm mb-1">Stage</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={stageId}
          onChange={(e) => {
            setStageId(e.target.value);
            setDayId(""); // reset day when stage changes
          }}
          required
        >
          <option value="" disabled>
            Select stage
          </option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Day (optional) */}
      <div>
        <label className="block text-sm mb-1">Day (optional)</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={dayId}
          onChange={(e) => setDayId(e.target.value)}
          disabled={!stageId}
        >
          <option value="">(No day — attach to stage)</option>
          {filteredDays.map((d) => (
            <option key={d.id} value={d.id}>
              {d.day_date}
              {d.week_name ? ` — ${d.week_name}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Match number */}
      <div>
        <label className="block text-sm mb-1">Match #</label>
        <input
          type="number"
          min={1}
          className="border px-3 py-2 rounded w-full"
          value={matchNo}
          onChange={(e) => setMatchNo(parseInt(e.target.value || "1", 10))}
          required
        />
      </div>

      {/* Scheduled (date only) */}
      <div>
        <label className="block text-sm mb-1">Scheduled (optional)</label>
        <input
          type="date" // only date
          className="border px-3 py-2 rounded w-full"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="planned">planned</option>
          <option value="live">live</option>
          <option value="completed">completed</option>
        </select>
      </div>

      <button className="px-3 py-2 border rounded">Save</button>
    </form>
  );
}
