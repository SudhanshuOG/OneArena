import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NewStageForm from "@/components/admin/NewStageForm";
import StageRow from "@/components/admin/StageRow";

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

  const [{ data: tRow }, { data: stages, error }] = await Promise.all([
    supabaseAdmin
      .from("tournaments")
      .select("name")
      .eq("id", tournamentId)
      .single(),

    // ✅ fix applied here
    (function () {
      let q = supabaseAdmin
        .from("stages")
        .select("id,name,order_index,deleted_at")
        .eq("tournament_id", tournamentId)
        .order("order_index", { ascending: true });

      return showArchived
        ? q.not("deleted_at", "is", null)
        : q.is("deleted_at", null);
    })(),
  ]);

  if (error) return <pre>DB error: {error.message}</pre>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Stages — {tRow?.name ?? "Tournament"}
        </h1>

        <div className="flex items-center gap-4">
          <Link
            href={`?archived=${showArchived ? "0" : "1"}`}
            className="underline text-sm"
          >
            {showArchived ? "← Back to active" : "View Archived"}
          </Link>
          <Link href="/admin/tournaments" className="underline text-sm">
            ← Back to tournaments
          </Link>
        </div>
      </div>

      {!showArchived && <NewStageForm tournamentId={tournamentId} />}

      {stages && stages.length > 0 ? (
        <ul className="divide-y border rounded">
          {stages.map((s) => (
            <StageRow key={s.id} stage={s as any} />
          ))}
        </ul>
      ) : (
        <p className="p-3 text-sm text-gray-500">No stages found.</p>
      )}
    </div>
  );
}
