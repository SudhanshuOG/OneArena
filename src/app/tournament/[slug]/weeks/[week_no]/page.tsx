// src/app/tournament/[slug]/weeks/[week_no]/page.tsx
import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import CreateDayForm from "../CreateDayForm";

type Props = { params: { slug: string; week_no: string } };

export default async function WeekDetail({ params }: Props) {
  const { slug, week_no } = params;
  // fetch tournament -> week
  const tRes = await supabase
    .from("tournaments")
    .select("id,title")
    .eq("slug", slug)
    .single();
  if (tRes.error || !tRes.data) {
    return <main className="p-6">Tournament not found</main>;
  }
  const tournament = tRes.data;

  const wRes = await supabase
    .from("weeks")
    .select("*")
    .eq("tournament_id", tRes.data.id)
    .eq("week_no", Number(week_no))
    .single();

  if (wRes.error || !wRes.data) {
    return <main className="p-6">Week not found</main>;
  }
  const week = wRes.data;

  // fetch days for this week
  const dRes = await supabase
    .from("days")
    .select("*")
    .eq("week_id", week.id)
    .order("day_no", { ascending: true });
  const days = dRes.data ?? [];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {tournament.title} — Week {week.week_no}
      </h1>
      <p className="mb-4 text-zinc-400">{week.title ?? ""}</p>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Create New Day</h2>
        {/* @ts-ignore */}
        <CreateDayForm
          serverWeekId={week.id}
          serverSlug={slug}
          serverWeekNo={Number(week_no)}
        />
      </div>

      <section>
        <h2 className="font-semibold mb-3">Days</h2>
        {days.length === 0 ? (
          <div className="text-zinc-400">No days yet — create one above.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {days.map((d: any) => (
              <article key={d.id} className="border rounded p-4">
                <h3 className="font-medium">
                  Day {d.day_no} — {d.title ?? "—"}
                </h3>
                <div className="mt-2 text-sm text-zinc-400">
                  Created: {new Date(d.created_at).toLocaleString()}
                </div>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/tournament/${slug}/weeks/${week_no}/days/${d.day_no}`}
                  >
                    View
                  </Link>
                  <Link
                    href={`/tournament/${slug}/weeks/${week_no}/days/edit/${d.id}`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                  <form
                    action={`/tournament/${slug}/weeks/${week_no}/days/delete/${d.id}`}
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
