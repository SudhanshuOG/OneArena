// src/app/tournament/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import React from "react";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default async function TournamentPage({ params }: Props) {
  const { slug } = params;
  let tournament = null;
  let error = null;

  try {
    const res = await supabase
      .from("tournaments")
      .select("*")
      .eq("slug", slug)
      .single();
    tournament = res.data;
    error = res.error;
  } catch (e) {
    error = String(e);
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tournament</h1>
        <div className="text-red-400">Error: {String(error)}</div>
        <p className="mt-4">
          <Link href="/">
            <a className="underline">Back to tournaments</a>
          </Link>
        </p>
      </main>
    );
  }

  if (!tournament) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tournament not found</h1>
        <p>
          <Link href="/">
            <a className="underline">Back to tournaments</a>
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2">{tournament.title}</h1>
      <p className="text-sm text-zinc-400 mb-4">
        slug: {tournament.slug} • region: {tournament.region ?? "—"}
      </p>

      <div className="space-y-3">
        <div>
          <strong>Start:</strong> {tournament.start_date ?? "—"}
        </div>
        <div>
          <strong>End:</strong> {tournament.end_date ?? "—"}
        </div>
        <div>
          <strong>Created:</strong> {tournament.created_at ?? "—"}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Actions</h2>
        <ul className="list-disc pl-6 text-sm text-zinc-300">
          <li>
            <Link
              href={`/tournament/${tournament.slug}/weeks`}
              className="underline"
            >
              View weeks & matches (placeholder)
            </Link>
          </li>
          <li>
            <Link href="/" className="underline">
              Back to tournaments
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
