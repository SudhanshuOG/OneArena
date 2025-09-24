// src/app/page.tsx
import { supabase } from "@/lib/supabaseClient";
import TournamentCard from "@/components/TournamentCard";

export default async function Page() {
  let data = null;
  let error = null;
  try {
    const res = await supabase
      .from("tournaments")
      .select("*")
      .order("created_at", { ascending: false });
    data = res.data;
    error = res.error;
  } catch (e) {
    error = String(e);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">OneArena — Tournaments</h1>

      {error && <div className="mb-4 text-red-400">Error: {String(error)}</div>}

      {!data || data.length === 0 ? (
        <div className="text-zinc-400">No tournaments yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((t: any) => (
            <TournamentCard
              key={t.id}
              id={t.id}
              title={t.title}
              slug={t.slug}
              region={t.region}
              start_date={t.start_date ?? null}
              end_date={t.end_date ?? null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
