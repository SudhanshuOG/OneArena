"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Stage = { id: string; name: string };
type Week = { id: string; title: string };
type Day = { id: string; title: string; week_id?: string; date?: string };

export default function NewMatchForm({
  tournamentId,
  stages,
}: {
  tournamentId: string;
  stages: Stage[];
}) {
  const router = useRouter();
  const [stageId, setStageId] = useState<string>(stages[0]?.id ?? "");
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>(""); // empty = attach to stage
  const [matchNo, setMatchNo] = useState<number>(1);
  const [scheduled, setScheduled] = useState<string>(""); // datetime-local value
  const [status, setStatus] = useState<string>("planned");
  const [isPending, start] = useTransition();

  useEffect(() => {
    if (stageId) {
      fetchWeeks();
      fetchDays();
      setSelectedWeek("");
      setSelectedDay("");
    }
  }, [stageId]);

  async function fetchWeeks() {
    const res = await fetch(`/api/admin/stages/${stageId}/weeks`);
    if (!res.ok) {
      setWeeks([]);
      return;
    }
    const j = await res.json();
    setWeeks(j || []);
  }

  async function fetchDays(weekId?: string) {
    const res = await fetch(`/api/admin/stages/${stageId}/days`);
    if (!res.ok) {
      setDays([]);
      return;
    }
    let j = await res.json();
    if (weekId) j = j.filter((d: Day) => d.week_id === weekId);
    setDays(j || []);
  }

  async function createWeek(title: string) {
    const res = await fetch(`/api/admin/stages/${stageId}/weeks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert("Week create failed: " + (j?.error || JSON.stringify(j)));
      return;
    }
    await fetchWeeks();
    setSelectedWeek(j.id);
  }

  async function createDay(title: string, date?: string, week_id?: string) {
    const res = await fetch(`/api/admin/stages/${stageId}/days`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        date: date || null,
        week_id: week_id || null,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert("Day create failed: " + (j?.error || JSON.stringify(j)));
      return;
    }
    await fetchDays(week_id);
    setSelectedDay(j.id);
  }

  function promptCreateWeek() {
    const val = prompt("Week title (e.g. Week 1)");
    if (val && val.trim()) createWeek(val.trim());
  }
  function promptCreateDay() {
    const val = prompt("Day title (e.g. Day 1)");
    if (val && val.trim())
      createDay(val.trim(), undefined, selectedWeek || undefined);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const payload = {
        stage_id: stageId,
        day_id: selectedDay || null,
        match_no: Number(matchNo),
        scheduled_at: scheduled ? new Date(scheduled).toISOString() : null,
        status,
      };
      const res = await fetch(
        `/api/admin/tournaments/${tournamentId}/matches/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || `Create failed (${res.status})`);
        return;
      }
      router.push(`/admin/tournaments/${tournamentId}/matches`);
    });
  }

  return (
    <form className="max-w-lg" onSubmit={submit}>
      <label className="block mb-2">
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

      <div className="flex gap-2 items-end mb-3">
        <div className="flex-1">
          <label className="block text-sm">Week (optional)</label>
          <select
            value={selectedWeek}
            onChange={(e) => {
              setSelectedWeek(e.target.value);
              fetchDays(e.target.value);
            }}
            className="w-full mt-1 p-2 rounded border bg-transparent"
          >
            <option value="">(No week — use stage/days)</option>
            {weeks.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={promptCreateWeek}
          className="px-3 py-1 border rounded"
        >
          + Week
        </button>
      </div>

      <div className="flex gap-2 items-end mb-3">
        <div className="flex-1">
          <label className="block text-sm">Day (optional)</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full mt-1 p-2 rounded border bg-transparent"
          >
            <option value="">(No day — attach to stage)</option>
            {days.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.title}
                {d.date ? ` — ${d.date}` : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={promptCreateDay}
          className="px-3 py-1 border rounded"
        >
          + Day
        </button>
      </div>

      <label className="block mb-2">
        Match #
        <input
          type="number"
          value={matchNo}
          onChange={(e) => setMatchNo(Number(e.target.value))}
          className="w-full mt-1 p-2 rounded border bg-transparent"
        />
      </label>

      <label className="block mb-2">
        Scheduled (optional)
        <input
          type="datetime-local"
          value={scheduled}
          onChange={(e) => setScheduled(e.target.value)}
          className="w-full mt-1 p-2 rounded border bg-transparent"
        />
      </label>

      <label className="block mb-4">
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => history.back()}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 border rounded bg-green-600">
          Save
        </button>
      </div>
    </form>
  );
}
