// app/debug/db/page.tsx
import { supabase } from '@/lib/supabase';

export default async function Page() {
  const { data: games, error } = await supabase
    .from('games')
    .select('id,name,slug')
    .order('name');

  if (error) {
    return <pre>DB error: {error.message}</pre>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">DB Check: Games</h1>
      <ul className="list-disc pl-6">
        {games?.map(g => (
          <li key={g.id}>{g.name} — {g.slug}</li>
        ))}
      </ul>
    </main>
  );
}
