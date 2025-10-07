import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const tournamentId = params.id;
  const [{ data: t }, { data: matches, error }] = await Promise.all([
    supabaseAdmin
      .from("tournaments")
      .select("name")
      .eq("id", tournamentId)
      .single(),
    supabaseAdmin
      .from("matches")
      .select("id,match_no,status,scheduled_at,stages(name)")
      .eq("stages.tournament_id", tournamentId)
      .order("match_no"),
  ]);
  if (error) return <pre>{error.message}</pre>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Matches — {t?.name}</h1>
        <Link
          href={`/admin/tournaments/${tournamentId}/matches/new`}
          className="px-3 py-1.5 border rounded"
        >
          + New
        </Link>
      </div>
      <ul className="divide-y border rounded">
        {matches?.map((m) => (
          <li key={m.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">
                Match #{m.match_no} — {m.stages?.name}
              </div>
              <div className="text-sm text-gray-500">
                {m.status} • {m.scheduled_at || "—"}
              </div>
            </div>
            <Link
              href={`/admin/matches/${m.id}/scoring`}
              className="text-sm border px-2 py-1 rounded"
            >
              Score
            </Link>
          </li>
        ))}
        {(!matches || matches.length === 0) && (
          <li className="p-3 text-sm text-gray-500">No matches yet.</li>
        )}
      </ul>
    </div>
  );
}
