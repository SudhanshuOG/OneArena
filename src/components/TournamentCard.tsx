// src/components/TournamentCard.tsx
import React from "react";

type Props = {
  id: string;
  title: string;
  slug: string;
  region?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export default function TournamentCard({
  id,
  title,
  slug,
  region,
  start_date,
  end_date,
}: Props) {
  return (
    <article className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-zinc-400 mt-1">
        slug: <span className="text-zinc-200">{slug}</span>
      </p>
      <div className="mt-3 text-sm flex gap-3 flex-wrap">
        <span className="px-2 py-1 bg-zinc-800 rounded">{region ?? "—"}</span>
        <span className="px-2 py-1 bg-zinc-800 rounded">
          {start_date ?? "—"}
        </span>
        <span className="px-2 py-1 bg-zinc-800 rounded">{end_date ?? "—"}</span>
      </div>
    </article>
  );
}
