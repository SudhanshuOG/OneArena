import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import DeleteTournamentButton from "@/components/admin/DeleteTournamentButton";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data, error } = await supabaseAdmin
    .from("tournaments")
    .select("id,name,slug,status,start_date,end_date,games(name)")
    .order("start_date", { ascending: false });

  if (error) return <pre>DB error: {error.message}</pre>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tournaments</h1>
        <Link
          href="/admin/tournaments/new"
          className="px-3 py-1.5 border rounded"
        >
          + New
        </Link>
      </div>

      <ul className="divide-y border rounded">
        {data?.map((t) => (
          <li key={t.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">
                {t.name}{" "}
                <span className="text-sm text-gray-500">({t.slug})</span>
              </div>
              <div className="text-sm text-gray-500">
                {t.games?.name} • {t.status} • {t.start_date} → {t.end_date}
              </div>
            </div>

            {/* right-side actions */}
            <div className="flex gap-2">
              <Link
                href={`/admin/tournaments/${t.id}/stages`}
                className="text-sm border px-2 py-1 rounded"
              >
                Manage Stages
              </Link>
              <Link
                href={`/admin/tournaments/${t.id}/matches`}
                className="text-sm border px-2 py-1 rounded"
              >
                Matches
              </Link>
              <DeleteTournamentButton id={t.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
