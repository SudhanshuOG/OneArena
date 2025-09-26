"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  serverTournamentId: string;
  serverWeekId: string;
  serverDayId: string;
  serverSlug: string;
  serverWeekNo: number;
  serverDayNo: number;
};

export default function CreateMatchForm({
  serverTournamentId,
  serverWeekId,
  serverDayId,
  serverSlug,
  serverWeekNo,
  serverDayNo,
}: Props) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [matchNo, setMatchNo] = useState<number | "">("");
  const [mapName, setMapName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!teamA || !teamB) {
      setMsg("Enter both team names");
      return;
    }

    setLoading(true);
    setMsg(null);

    const payload = {
      tournament_id: serverTournamentId,
      week_id: serverWeekId,
      day_id: serverDayId,
      match_no: matchNo === "" ? null : Number(matchNo),
      map: mapName || null,
      datetime: datetime ? new Date(datetime).toISOString() : null,
      metadata: { team_a_name: teamA, team_b_name: teamB },
    };

    const { error } = await supabase.from("matches").insert([payload]);
    setLoading(false);
    if (error) {
      setMsg("Error: " + error.message);
      return;
    }

    setMsg("Match created ✔");
    // go to matches list for this day
    setTimeout(() => {
      window.location.href = `/tournament/${serverSlug}/weeks/${serverWeekNo}/days/${serverDayNo}/matches`;
    }, 600);
  }

  return (
    <form
      onSubmit={handleCreate}
      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
    >
      <input
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
        placeholder="Team A name"
        className="p-2 bg-zinc-900 rounded"
      />
      <input
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
        placeholder="Team B name"
        className="p-2 bg-zinc-900 rounded"
      />
      <input
        type="number"
        value={matchNo}
        onChange={(e) =>
          setMatchNo(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Match no"
        className="p-2 bg-zinc-900 rounded"
      />
      <input
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
        placeholder="Map (optional)"
        className="p-2 bg-zinc-900 rounded"
      />
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        className="p-2 bg-zinc-900 rounded col-span-2"
      />
      <div className="col-span-2 flex gap-2 items-center">
        <button className="px-3 py-1 bg-sky-600 rounded" disabled={loading}>
          {loading ? "Creating..." : "Create Match"}
        </button>
        {msg && <div className="text-sm text-zinc-300">{msg}</div>}
      </div>
    </form>
  );
}
