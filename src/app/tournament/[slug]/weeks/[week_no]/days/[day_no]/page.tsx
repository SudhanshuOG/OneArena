// src/app/tournament/[slug]/weeks/[week_no]/days/[day_no]/page.tsx
import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Props = { params: { slug: string; week_no: string; day_no: string } };

export default async function DayDetail({ params }: Props) {
  const { slug, week_no, day_no } = params;

  // fetch tournament, week, day
  const tRes = await supabase
    .from("tournaments")
    .select("id,title")
    .eq("slug", slug)
    .single();
  if (tRes.error || !tRes.data)
    return <main className="p-6">Tournament not found</main>;

  const wRes = await supabase
    .from("weeks")
    .select("id,week_no,title")
    .eq("tournament_id", tRes.data.id)
    .eq("week_no", Number(week_no))
    .single();
  if (wRes.error || !wRes.data)
    return <main className="p-6">Week not found</main>;

  const dRes = await supabase
    .from("days")
    .select("*")
    .eq("week_id", wRes.data.id)
    .eq("day_no", Number(day_no))
    .single();
  if (dRes.error || !dRes.data)
    return <main className="p-6">Day not found</main>;

  const day = dRes.data;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {tRes.data.title} — Week {wRes.data.week_no} — Day {day.day_no}
      </h1>
      <p className="text-zinc-400 mb-4">{day.title ?? ""}</p>

      <nav className="flex gap-4 mb-4">
        <Link
          href={`/tournament/${slug}/weeks/${week_no}/days/${day_no}/matches`}
        >
          Matches
        </Link>
        <Link
          href={`/tournament/${slug}/weeks/${week_no}/days/${day_no}/standings`}
        >
          Standings
        </Link>
        <Link
          href={`/tournament/${slug}/weeks/${week_no}/days/${day_no}/highlights`}
        >
          Highlights
        </Link>
      </nav>

      <section className="border rounded p-4">
        <p className="text-zinc-400">
          Select a tab above to view content (matches / standings / highlights).
        </p>
      </section>
    </main>
  );
}
