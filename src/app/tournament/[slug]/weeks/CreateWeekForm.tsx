"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  serverTournamentId: string;
  serverSlug: string;
};

export default function CreateWeekForm({
  serverTournamentId,
  serverSlug,
}: Props) {
  const [weekNo, setWeekNo] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!weekNo) {
      setMsg("Enter week number");
      return;
    }
    setLoading(true);
    setMsg(null);
    const { data, error } = await supabase
      .from("weeks")
      .insert([
        {
          tournament_id: serverTournamentId,
          week_no: Number(weekNo),
          title: title || null,
        },
      ])
      .select()
      .single();
    setLoading(false);
    if (error) {
      setMsg("Error: " + error.message);
      return;
    }
    setMsg("Week created. Refreshing page...");
    // simple refresh
    setTimeout(() => {
      window.location.href = `/tournament/${serverSlug}/weeks`;
    }, 800);
  }

  return (
    <form onSubmit={handleCreate} className="flex gap-2 items-center">
      <input
        type="number"
        min={1}
        value={weekNo}
        onChange={(e) =>
          setWeekNo(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Week no (1)"
        className="px-2 py-1 rounded bg-zinc-900"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Optional title"
        className="px-2 py-1 rounded bg-zinc-900"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-1 rounded bg-sky-600"
      >
        {loading ? "Creating..." : "Create"}
      </button>
      {msg && <div className="text-sm text-zinc-300 ml-3">{msg}</div>}
    </form>
  );
}
