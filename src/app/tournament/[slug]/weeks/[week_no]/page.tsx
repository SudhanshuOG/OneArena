// src/app/tournament/[slug]/weeks/[week_no]/page.tsx
import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Props = { params: { slug: string; week_no: string } };

export default async function WeekDetail({ params }: Props) {
  const { slug, week_no } = params;
  // fetch tournament id
  const tRes = await supabase
    .from("tournaments")
    .select("id,title")
    .eq("slug", slug)
    .single();
  if (tRes.error || !tRes.data) {
    return (
      <main className="p-6">
        <div> Tournament not found </div>
      </main>
    );
  }
  const tournament = tRes.data;

  // find the week row
  const wRes = await supabase
    .from("weeks")
    .select("*")
    .eq("tournament_id", tournament.id)
    .eq("week_no", Number(week_no))
    .single();
  if (wRes.error || !wRes.data) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Week not found</h1>
        <p>
          <Link href={`/tournament/${slug}/weeks`}>
            <a className="underline">Back</a>
          </Link>
        </p>
      </main>
    );
  }
  const week = wRes.data;

  // fetch matches for this tournament + week_no
  const mRes = await supabase
    .from("matches")
    .select("*, team_a:team_a(id,name,tag), team_b:team_b(id,name,tag)")
    .eq("tournament_id", tournament.id)
    .eq("match_no", null, { head: false }); // ignore match_no for filtering; we use weeks relation instead
  // matches table currently doesn't reference week_id in earlier schema, so we will treat match_no as per-week match index
  // Better approach: if you prefer to link matches to weeks, we can add week_id column to matches later.
  // For now we'll show all matches for this tournament and filter by datetime/week if you want.

  const matches = mRes.data ?? [];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {tournament.title} — Week {week.week_no}
      </h1>
      <p className="text-sm text-zinc-400 mb-4">{week.title ?? ""}</p>

      <p className="mb-4">
        <Link href={`/tournament/${slug}/weeks`}>
          <a className="underline">← Back to weeks</a>
        </Link>
      </p>

      {matches.length === 0 ? (
        <div className="text-zinc-400">
          No matches found for this tournament yet.
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m: any) => (
            <div key={m.id} className="border rounded p-3">
              <div className="font-medium">
                {m.team_a?.name ?? "Team A"} vs {m.team_b?.name ?? "Team B"}
              </div>
              <div className="text-sm text-zinc-400">
                {m.map ?? "—"} • {m.score_a ?? 0} : {m.score_b ?? 0} •{" "}
                {m.datetime ? new Date(m.datetime).toLocaleString() : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
