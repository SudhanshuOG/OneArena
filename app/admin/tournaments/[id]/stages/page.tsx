import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NewStageForm from "@/components/admin/NewStageForm";
import StageRow from "@/components/admin/StageRow";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const tournamentId = params.id;

  const [{ data: tRow }, { data: stages, error }] = await Promise.all([
    supabaseAdmin
      .from("tournaments")
      .select("name")
      .eq("id", tournamentId)
      .single(),
    supabaseAdmin
      .from("stages")
      .select("id,name,order_index")
      .eq("tournament_id", tournamentId)
      .order("order_index", { ascending: true }),
  ]);

  if (error) return <pre>DB error: {error.message}</pre>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Stages — {tRow?.name ?? "Tournament"}
        </h1>
        <Link href="/admin/tournaments" className="underline text-sm">
          ← Back to tournaments
        </Link>
      </div>

      <NewStageForm tournamentId={tournamentId} />

      <ul className="divide-y border rounded">
        {stages?.map((s) => (
          <li key={s.id} className="p-3 flex items-center justify-between">
            <span>
              {s.order_index}. {s.name}
            </span>
          </li>
        ))}
        {(!stages || stages.length === 0) && (
          <li className="p-3 text-sm text-gray-500">No stages yet.</li>
        )}
      </ul>
      <ul className="divide-y border rounded">
        {stages?.map((s) => (
          <StageRow key={s.id} stage={s as any} />
        ))}
        {(!stages || stages.length === 0) && (
          <li className="p-3 text-sm text-gray-500">No stages yet.</li>
        )}
      </ul>
    </div>
  );
}
