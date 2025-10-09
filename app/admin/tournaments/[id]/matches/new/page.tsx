import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NewMatchForm from "@/components/admin/NewMatchForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const tournamentId = params.id;

  const { data: stages, error: sErr } = await supabaseAdmin
    .from("stages")
    .select("id,name,order_index")
    .eq("tournament_id", tournamentId)
    .is("deleted_at", null)
    .order("order_index", { ascending: true });

  if (sErr) return <pre>DB error: {sErr.message}</pre>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Match</h1>
        <Link
          href={`/admin/tournaments/${tournamentId}/matches`}
          className="underline text-sm"
        >
          ← Back
        </Link>
      </div>

      <NewMatchForm tournamentId={tournamentId} stages={stages ?? []} />
    </div>
  );
}
