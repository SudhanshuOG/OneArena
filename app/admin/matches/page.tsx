import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

export default async function AllMatchesPage() {
  const { data, error } = await supabaseAdmin
    .from("matches")
    .select("id, match_no, status, scheduled_at, stages(name)")
    .order("scheduled_at", { ascending: false });

  if (error) return <pre>DB Error: {error.message}</pre>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Matches</h1>
      <ul className="space-y-3">
        {data?.map((m) => (
          <li
            key={m.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">
                #{m.match_no} — {m.stages?.name}
              </div>
              <div className="text-sm text-gray-500">
                {m.status} • {m.scheduled_at ?? "unscheduled"}
              </div>
            </div>
            <Link
              href={`/admin/matches/${m.id}/edit`}
              className="px-3 py-1 text-sm border rounded"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
