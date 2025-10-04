import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data: games, error } = await supabaseAdmin
    .from("games")
    .select("id,name,slug")
    .order("name");

  if (error) return <pre>DB error: {error.message}</pre>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Games</h1>
        <Link href="/admin/games/new" className="px-3 py-1.5 border rounded">
          + New
        </Link>
      </div>
      <ul className="divide-y border rounded">
        {games?.map((g) => (
          <li key={g.id} className="p-3 flex items-center justify-between">
            <span>
              {g.name} — <span className="text-sm text-gray-500">{g.slug}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
