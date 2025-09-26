import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import CreateMatchForm from "../CreateMatchForm";

type Props = { params: { slug: string; week_no: string; day_no: string } };

export default async function MatchesPage({ params }: Props) {
  const { slug, week_no, day_no } = params;

  const tRes = await supabase
    .from("tournaments")
    .select("id,title")
    .eq("slug", slug)
    .single();
  if (tRes.error || !tRes.data)
    return <main className="p-6">Tournament not found</main>;
  const tournament = tRes.data;

  const wRes = await supabase
    .from("weeks")
    .select("id")
    .eq("tournament_id", tournament.id)
    .eq("week_no", Number(week_no))
    .single();
  if (wRes.error || !wRes.data)
    return <main className="p-6">Week not found</main>;

  const dRes = await supabase
    .from("days")
    .select("id,day_no,title")
    .eq("week_id", wRes.data.id)
    .eq("day_no", Number(day_no))
    .single();
  if (dRes.error || !dRes.data)
    return <main className="p-6">Day not found</main>;
  const day = dRes.data;

  const mRes = await supabase
    .from("matches")
    .select("*")
    .eq("day_id", day.id)
    .order("match_no", { ascending: true });
  const matches = mRes.data ?? [];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-3">
        {tournament.title} — Week {week_no} — Day {day.day_no}
      </h1>
      <p className="mb-4 text-zinc-400">{day.title ?? ""}</p>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Create Match</h2>
        {/* @ts-ignore */}
        <CreateMatchForm
          serverTournamentId={tournament.id}
          serverWeekId={wRes.data.id}
          serverDayId={day.id}
          serverSlug={slug}
          serverWeekNo={Number(week_no)}
          serverDayNo={Number(day_no)}
        />
      </section>

      <section>
        <h2 className="font-semibold mb-3">Matches</h2>
        {matches.length === 0 ? (
          <div className="text-zinc-400">No matches for this day yet.</div>
        ) : (
          <div className="space-y-4">
            {matches.map((m: any) => (
              <article key={m.id} className="border rounded p-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Match {m.match_no ?? "—"}</div>
                    <div className="text-sm text-zinc-400">
                      {m.metadata?.team_a_name ?? "Team A"} vs{" "}
                      {m.metadata?.team_b_name ?? "Team B"}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    {m.score_a ?? 0} — {m.score_b ?? 0}
                  </div>
                </div>
                <div className="mt-2 text-sm text-zinc-400">
                  {m.map ?? ""}{" "}
                  {m.datetime
                    ? ` • ${new Date(m.datetime).toLocaleString()}`
                    : ""}
                </div>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/tournament/${slug}/weeks/${week_no}/days/${day_no}/matches/edit/${m.id}`}
                  >
                    Edit
                  </Link>
                  <form
                    action={`/tournament/${slug}/weeks/${week_no}/days/${day_no}/matches/delete/${m.id}`}
                    method="post"
                  >
                    <button type="submit" className="text-red-500">
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
