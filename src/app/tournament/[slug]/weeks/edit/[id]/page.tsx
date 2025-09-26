import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type Props = { params: { slug: string; id: string } };

export default async function EditWeekPage({ params }: Props) {
  const { slug, id } = params;

  const { data: week, error } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !week) {
    return <main className="p-6">Week not found</main>;
  }

  async function updateWeek(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const weekNo = Number(formData.get("week_no") || week.week_no);

    const { error: upErr } = await supabase
      .from("weeks")
      .update({ title, week_no: weekNo })
      .eq("id", id);

    if (upErr) throw new Error(upErr.message);
    revalidatePath(`/tournament/${slug}/weeks`);
    redirect(`/tournament/${slug}/weeks`);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Week</h1>
      <form action={updateWeek} className="space-y-3 max-w-md">
        <input
          name="week_no"
          type="number"
          defaultValue={week.week_no}
          className="w-full p-2 bg-zinc-900 rounded"
          placeholder="Week no"
        />
        <input
          name="title"
          type="text"
          defaultValue={week.title ?? ""}
          className="w-full p-2 bg-zinc-900 rounded"
          placeholder="Optional title"
        />
        <div className="flex gap-3">
          <button className="px-3 py-1 bg-sky-600 rounded">Save</button>
          <Link
            href={`/tournament/${slug}/weeks`}
            className="px-3 py-1 bg-zinc-800 rounded"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
