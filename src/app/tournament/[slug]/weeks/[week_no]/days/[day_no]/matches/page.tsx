import React from "react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";
import CreateMatchForm from "../../CreateMatchForm";
import DeleteMatchButton from "./DeleteMatchButton";

type Props = { params: { slug: string; week_no: string; day_no: string } };

export default async function MatchesPage({ params }: Props) {
  const { slug, week_no, day_no } = params;

  // ---- server action: delete match ----
  async function deleteMatchAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const _slug = String(formData.get("slug"));
    const _week = String(formData.get("week_no"));
    const _day = String(formData.get("day_no"));

    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) {
      console.error("Delete match error:", error);
      throw new Error(error.message);
    }
    revalidatePath(`/tournament/${_slug}/weeks/${_week}/days/${_day}/matches`);
  }
  // ------------------------------------

  // tournament
  const tRes = await supabase
    .from("tournaments")
    .select("id,title,slug")
    .eq("slug", slug)
    .single();
  if (tRes.error || !tRes.data)
    return <main className="p-6">Tournament not found</main>;
  const tournament = tRes.data;

  // week
  const wRes = await supabase
    .from("weeks")
    .select("id,week_no")
    .eq("tournament_id", tournament.id)
    .eq("week_no", Number(week_no))
    .single();
  if (wRes.error || !wRes.data)
    return <main className="p-6">Week not found</main>;
  const week = wRes.data;

  // day
  const dRes = await supabase
    .from("days")
    .select("id,day_no,title")
    .eq("week_id", week.id)
    .eq("day_no", Number(day_no))
    .single();
  if (dRes.error || !dRes.data)
    return <main className="p-6">Day not found</main>;
  const day = dRes.data;

  // matches for this day
  const mRes = await supabase
    .from("matches")
    .select("*")
    .eq("day_id", day.id)
    .order("match_no", { ascending: true });
  const matches = mRes.data ?? [];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-1">
        {tournament.title} — Week {week_no} — Day {day.day_no}
      </h1>
      <p className="mb-4 text-zinc-400">{day.title ?? ""}</p>

      <p className="mb-4">
        <Link href={`/tournament/${slug}/weeks/${week_no}/days/${day_no}`}>
          ← Back to day
        </Link>
      </p>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Create Match</h2>
        {/* @ts-ignore */}
        <CreateMatchForm
          serverTournamentId={tournament.id}
          serverWeekId={week.id}
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
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Match {m.match_no ?? "—"}</div>
                    <div className="text-sm text-zinc-400">
                      {m.metadata?.team_a_name ?? "Team A"} vs{" "}
                      {m.metadata?.team_b_name ?? "Team B"}
                    </div>
                    <div className="mt-1 text-sm text-zinc-400">
                      {m.map ?? ""}{" "}
                      {m.datetime
                        ? ` • ${new Date(m.datetime).toLocaleString()}`
                        : ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {m.score_a ?? 0} — {m.score_b ?? 0}
                    </div>
                    <div className="mt-2">
                      <DeleteMatchButton
                        action={deleteMatchAction}
                        matchId={m.id}
                        slug={slug}
                        weekNo={Number(week_no)}
                        dayNo={Number(day_no)}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
