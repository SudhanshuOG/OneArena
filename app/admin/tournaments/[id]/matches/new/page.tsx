import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NewMatchForm from "@/components/admin/NewMatchForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const tournamentId = params.id;

  // 1) Stages of this tournament
  const { data: stages, error: sErr } = await supabaseAdmin
    .from("stages")
    .select("id,name")
    .eq("tournament_id", tournamentId)
    .order("order_index");
  if (sErr) return <pre>DB error: {sErr.message}</pre>;

  // 2) All days under these stages (optional layer)
  // we also join week name for display if you created `weeks` table
  const stageIds = (stages || []).map((s) => s.id);
  let days: {
    id: string;
    stage_id: string;
    day_date: string;
    week_name?: string;
  }[] = [];

  if (stageIds.length > 0) {
    const { data: dRows, error: dErr } = await supabaseAdmin
      .from("days")
      .select("id,stage_id,day_date,weeks(name)")
      .in("stage_id", stageIds)
      .order("order_index");
    if (dErr) return <pre>DB error: {dErr.message}</pre>;

    days =
      (dRows || []).map((d: any) => ({
        id: d.id,
        stage_id: d.stage_id,
        day_date: d.day_date,
        week_name: d.weeks?.name || undefined,
      })) || [];
  }

  return (
    <NewMatchForm
      tournamentId={tournamentId}
      stages={stages || []}
      days={days}
    />
  );
}
