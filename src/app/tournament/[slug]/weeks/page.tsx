// src/app/tournament/[slug]/weeks/page.tsx
import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import CreateWeekForm from "./CreateWeekForm";

type Props = { params: { slug: string } };

export default async function TournamentWeeksPage({ params }: Props) {
  const { slug } = params;
  const tRes = await supabase
    .from("tournaments")
    .select("id,title,slug")
    .eq("slug", slug)
    .single();

  if (tRes.error || !tRes.data) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Tournament not found</h1>
        <p>
          <Link href="/">Back</Link>
        </p>
        <div className="mt-4 text-red-400">
          Error: {String(tRes.error?.message ?? "not found")}
        </div>
      </main>
    );
  }

  const tournament = tRes.data;
  const wRes = await supabase
    .from("weeks")
    .select("*")
    .eq("tournament_id", tournament.id)
    .order("week_no", { ascending: true });

  const weeks = wRes.data ?? [];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{tournament.title} — Weeks</h1>

      <p className="mb-4">
        <Link href={`/tournament/${slug}`}>← Back to tournament</Link>
      </p>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Create new week</h2>
        {/* client component */}
        {/* @ts-ignore */}
        <CreateWeekForm serverTournamentId={tournament.id} serverSlug={slug} />
      </section>

      <section>
        <h2 className="font-semibold mb-3">Weeks</h2>

        {weeks.length === 0 ? (
          <div className="text-zinc-400">No weeks yet — create one above.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weeks.map((w: any) => (
              <article key={w.id} className="border rounded p-4">
                <h3 className="font-medium">
                  Week {w.week_no} — {w.title ?? "—"}
                </h3>
                <div className="mt-2 text-sm text-zinc-400">
                  Created: {new Date(w.created_at).toLocaleString()}
                </div>
                <div className="mt-3">
                  <Link href={`/tournament/${slug}/weeks/${w.week_no}`}>
                    View matches for this week
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
