"use client";

type Props = {
  action: (formData: FormData) => void; // server action aayegi yahan
  weekId: string;
  slug: string;
};

export default function DeleteWeekButton({ action, weekId, slug }: Props) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!confirm("Delete this week? All its days/matches will be removed.")) {
      e.preventDefault();
    }
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" value={weekId} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        onClick={handleClick}
        className="px-2 py-1 rounded bg-red-600 hover:bg-red-500"
      >
        Delete
      </button>
    </form>
  );
}
