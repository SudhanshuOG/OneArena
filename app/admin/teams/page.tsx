import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const dynamic = "force-dynamic";
import TeamRow from "@/components/admin/TeamRow";

export default async function Page() {
  const { data, error } = await supabaseAdmin
    .from("teams")
    .select("id,name,short_name,games(name)")
    .order("name");
  if (error) return <pre>{error.message}</pre>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <Link href="/admin/teams/new" className="px-3 py-1.5 border rounded">
          + New
        </Link>
      </div>
      <ul className="divide-y border rounded">
        {data?.map((t) => (
          <li key={t.id} className="p-3">
            {t.name}{" "}
            <span className="text-sm text-gray-500">
              ({t.short_name || "-"})
            </span>
            <span className="text-sm text-gray-500"> — {t.games?.name}</span>
          </li>
        ))}
      </ul>
      <ul className="divide-y border rounded">
        {data?.map((t) => (
          <TeamRow key={t.id} team={t as any} />
        ))}
      </ul>
    </div>
  );
}
