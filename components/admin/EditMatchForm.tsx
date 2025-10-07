"use client";

import { useState, useTransition } from "react";

type Match = {
  id: string;
  match_no: number;
  status: string;
  scheduled_at: string | null;
  stage_id: string;
};
type Stage = { id: string; name: string };

export default function EditMatchForm({
  match,
  stages,
  tournamentId,
}: {
  match: Match;
  stages: Stage[];
  tournamentId: string;
}) {
  const [matchNo, setMatchNo] = useState<number>(match.match_no);
  const [status, setStatus] = useState<string>(match.status || "planned");
  const [stageId, setStageId] = useState<string>(match.stage_id);
  const [scheduled, setScheduled] = useState<string>(
    match.scheduled_at ? match.scheduled_at.slice(0, 16) : ""
  ); // yyyy-MM-ddTHH:mm
  const [pending, start] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await fetch(`/api/admin/matches/${match.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_no: Number(matchNo),
          status,
          stage_id: stageId,
          scheduled_at: scheduled ? new Date(scheduled).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || `Update failed (${res.status})`);
        return;
      }
      window.location.href = `/admin/tournaments/${tournamentId}/matches`;
    });
  };

  return (
    <form onSubmit={onSubmit} className="border rounded p-4 space-y-4 max-w-xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Match #
          <input
            type="number"
            min={1}
            value={matchNo}
            onChange={(e) => setMatchNo(parseInt(e.target.value || "1", 10))}
            className="w-full mt-1 p-2 rounded border bg-transparent"
          />
        </label>

        <label className="text-sm">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-1 p-2 rounded border bg-transparent"
          >
            <option value="planned">planned</option>
            <option value="ongoing">ongoing</option>
            <option value="completed">completed</option>
          </select>
        </label>
      </div>

      <label className="text-sm block">
        Stage
        <select
          value={stageId}
          onChange={(e) => setStageId(e.target.value)}
          className="w-full mt-1 p-2 rounded border bg-transparent"
        >
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm block">
        Scheduled at (optional)
        <input
          type="datetime-local"
          value={scheduled}
          onChange={(e) => setScheduled(e.target.value)}
          className="w-full mt-1 p-2 rounded border bg-transparent"
        />
      </label>

      <div className="flex gap-2 justify-end">
        <a
          href={`/admin/tournaments/${tournamentId}/matches`}
          className="px-4 py-2 rounded border"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded border"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
