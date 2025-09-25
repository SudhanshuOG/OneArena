"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  serverWeekId: string;
  serverSlug: string;
  serverWeekNo: number;
};

export default function CreateDayForm({
  serverWeekId,
  serverSlug,
  serverWeekNo,
}: Props) {
  const [dayNo, setDayNo] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!dayNo) {
      setMsg("Enter day number");
      return;
    }
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase
      .from("days")
      .insert([
        {
          week_id: serverWeekId,
          day_no: Number(dayNo),
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
    setMsg("Day created. Reloading...");
    setTimeout(() => {
      window.location.href = `/tournament/${serverSlug}/weeks/${serverWeekNo}`;
    }, 700);
  }

  return (
    <form onSubmit={handleCreate} className="flex gap-2 items-center">
      <input
        type="number"
        min={1}
        value={dayNo}
        onChange={(e) =>
          setDayNo(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Day no (1)"
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
        className="px-3 py-1 rounded bg-green-600"
      >
        {loading ? "Creating..." : "Create Day"}
      </button>
      {msg && <div className="text-sm text-zinc-300 ml-3">{msg}</div>}
    </form>
  );
}
