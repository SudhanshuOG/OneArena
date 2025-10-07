import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import MatchActions from "@/components/admin/MatchActions";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tournamentId = params.id;
  const showArchived = searchParams?.archived === "1";

  const [{ data: t }, { data: matches, error }] = await Promise.all([
    supabaseAdmin
      .from("tournaments")
      .select("name")
      .eq("id", tournamentId)
      .single(),
    (function () {
      let q = supabaseAdmin
        .from("matches")
        .select("id,match_no,status,scheduled_at,deleted_at,stages(name)")
        .eq("stages.tournament_id", tournamentId)
        .order("match_no");
      return showArchived
        ? q.not("deleted_at", "is", null)
        : q.is("deleted_at", null);
    })(),
  ]);

  if (error) return <pre>{error.message}</pre>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Matches — {t?.name}{" "}
          {showArchived ? <span className="text-sm">(Archived)</span> : null}
        </h1>
        <div className="flex gap-2">
          <Link
            href={
              showArchived
                ? `/admin/tournaments/${tournamentId}/matches`
                : `/admin/tournaments/${tournamentId}/matches?archived=1`
            }
            className="px-3 py-1.5 border rounded"
          >
            {showArchived ? "Back to Active" : "View Archived"}
          </Link>
          {!showArchived && (
            <Link
              href={`/admin/tournaments/${tournamentId}/matches/new`}
              className="px-3 py-1.5 border rounded"
            >
              + New
            </Link>
          )}
        </div>
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

            <div className="flex gap-2">
              {!showArchived && (
                <Link
                  href={`/admin/matches/${m.id}/edit`}
                  className="text-sm border px-2 py-1 rounded"
                >
                  Edit
                </Link>
              )}
              <Link
                href={`/admin/matches/${m.id}/scoring`}
                className="text-sm border px-2 py-1 rounded"
              >
                Score
              </Link>

              {/* 🔽 All interactive buttons moved to a client component */}
              <MatchActions matchId={m.id} archived={showArchived} />
            </div>
          </li>
        ))}

        {(!matches || matches.length === 0) && (
          <li className="p-3 text-sm text-gray-500">
            {showArchived ? "No archived matches." : "No matches yet."}
          </li>
        )}
      </ul>
    </div>
  );
}
