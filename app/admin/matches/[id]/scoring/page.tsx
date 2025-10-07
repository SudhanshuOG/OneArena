import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ScoringForm from "@/components/admin/ScoringForm";
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const matchId = params.id;

  const { data: match, error } = await supabaseAdmin
    .from("matches")
    .select(
      "id,match_no,status,stages(tournament_id, name), stages:tournament_id"
    )
    .eq("id", matchId)
    .single();

  if (error) return <pre>DB error: {error.message}</pre>;

  // teams by game (via tournament -> game)
  const { data: tRow } = await supabaseAdmin
    .from("tournaments")
    .select("game_id,name")
    .eq("id", match.stages.tournament_id)
    .single();

  const { data: teams } = await supabaseAdmin
    .from("teams")
    .select("id,name")
    .eq("game_id", tRow?.game_id)
    .order("name");

  const { data: existing } = await supabaseAdmin
    .from("match_results")
    .select("team_id,placement,kills,points")
    .eq("match_id", matchId)
    .order("points", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Scoring — Match #{match?.match_no} ({tRow?.name})
      </h1>
      <ScoringForm
        matchId={matchId}
        teams={teams || []}
        initial={existing || []}
      />
    </div>
  );
}
