import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import EditMatchForm from "@/components/admin/EditMatchForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const matchId = params.id;

  // fetch match + tournament id via stage
  const { data: m, error } = await supabaseAdmin
    .from("matches")
    .select(
      "id, match_no, status, scheduled_at, stage_id, stages(tournament_id,name)"
    )
    .eq("id", matchId)
    .single();

  if (error) return <pre>DB error: {error.message}</pre>;
  if (!m) return notFound();

  const tournamentId = m.stages?.tournament_id as string | undefined;
  if (!tournamentId) return notFound();

  // stages for dropdown (active ones)
  const { data: stages } = await supabaseAdmin
    .from("stages")
    .select("id, name")
    .eq("tournament_id", tournamentId)
    .is("deleted_at", null)
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Edit Match — {m.stages?.name ?? "Stage"}
        </h1>
        <Link
          href={`/admin/tournaments/${tournamentId}/matches`}
          className="px-3 py-1.5 border rounded"
        >
          ← Back to matches
        </Link>
      </div>

      <EditMatchForm
        match={{
          id: m.id,
          match_no: m.match_no,
          status: m.status,
          scheduled_at: m.scheduled_at,
          stage_id: m.stage_id,
        }}
        stages={stages ?? []}
        tournamentId={tournamentId}
      />
    </div>
  );
}
