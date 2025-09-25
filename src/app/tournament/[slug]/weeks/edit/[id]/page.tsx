import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

type Props = { params: { id: string; slug: string } };

export default async function EditWeekPage({ params }: Props) {
  const { id, slug } = params;

  // fetch week details
  const { data: week, error } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !week) {
    return <div className="p-6 text-red-500">Week not found</div>;
  }

  async function updateWeek(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const week_no = Number(formData.get("week_no"));

    await supabase.from("weeks").update({ title, week_no }).eq("id", id);
    redirect(`/tournament/${slug}/weeks`);
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Week</h1>
      <form action={updateWeek} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Week No</label>
          <input
            name="week_no"
            type="number"
            defaultValue={week.week_no}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            name="title"
            type="text"
            defaultValue={week.title ?? ""}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
