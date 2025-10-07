import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import DeleteTournamentButton from "@/components/admin/DeleteTournamentButton";
import EditTournamentDialog from "./EditTournamentDialog";

// server actions for forms (archived view)
import { restoreTournament, hardDeleteTournament } from "./actions";

export const dynamic = "force-dynamic";

// server actions must be defined at module scope
async function restoreFromForm(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await restoreTournament(id);
}

async function hardDeleteFromForm(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await hardDeleteTournament(id);
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const showArchived = searchParams?.archived === "1";

  // base query + archived filter
  let query = supabaseAdmin
    .from("tournaments")
    .select(
      "id,name,slug,status,start_date,end_date,game_id,deleted_at,games(name)"
    )
    .order("start_date", { ascending: false });

  query = showArchived
    ? query.not("deleted_at", "is", null)
    : query.is("deleted_at", null);

  const { data, error } = await query;
  if (error) return <pre>DB error: {error.message}</pre>;

  const { data: games } = await supabaseAdmin
    .from("games")
    .select("id,name")
    .order("name");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Tournaments {showArchived ? "(Archived)" : ""}
        </h1>

        <div className="flex gap-2">
          <Link
            href={`/admin/tournaments${showArchived ? "" : "?archived=1"}`}
            className="px-3 py-1.5 border rounded"
          >
            {showArchived ? "Back to Active" : "Archived"}
          </Link>

          {!showArchived && (
            <Link
              href="/admin/tournaments/new"
              className="px-3 py-1.5 border rounded"
            >
              + New
            </Link>
          )}
        </div>
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
                {showArchived && t.deleted_at ? (
                  <span className="ml-2 opacity-70">(archived)</span>
                ) : null}
              </div>
            </div>

            <div className="flex gap-2">
              {showArchived ? (
                <>
                  {/* ARCHIVED VIEW */}
                  <form action={restoreFromForm}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="text-sm border px-2 py-1 rounded">
                      Restore
                    </button>
                  </form>

                  <form action={hardDeleteFromForm}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="text-sm border border-red-500 text-red-500 px-2 py-1 rounded">
                      Delete forever
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* ACTIVE VIEW */}
                  <EditTournamentDialog
                    tournament={t as any}
                    games={games ?? []}
                  />

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
                </>
              )}
            </div>
          </li>
        ))}

        {data?.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">
            {showArchived ? "No archived tournaments." : "No tournaments yet."}
          </li>
        )}
      </ul>
    </div>
  );
}
