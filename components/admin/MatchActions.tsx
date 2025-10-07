"use client";

type Props = { matchId: string; archived: boolean };

export default function MatchActions({ matchId, archived }: Props) {
  async function post(url: string, method: "POST" | "DELETE") {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.error || `Request failed (${res.status})`);
      return;
    }
    // Reload current page to reflect changes
    window.location.reload();
  }

  if (archived) {
    return (
      <div className="flex gap-2">
        <button
          className="text-sm border px-2 py-1 rounded text-green-500"
          onClick={async () => {
            if (!confirm("Restore this match?")) return;
            await post(`/api/admin/matches/${matchId}/restore`, "POST");
          }}
        >
          Restore
        </button>
        <button
          className="text-sm border px-2 py-1 rounded text-red-500"
          onClick={async () => {
            if (
              !confirm("Permanently delete this match? This cannot be undone.")
            )
              return;
            await post(`/api/admin/matches/${matchId}`, "DELETE");
          }}
        >
          Delete Forever
        </button>
      </div>
    );
  }

  // Active view
  return (
    <button
      className="text-sm border border-red-500 text-red-500 px-2 py-1 rounded"
      onClick={async () => {
        if (!confirm("Archive this match?")) return;
        await post(`/api/admin/matches/${matchId}/archive`, "POST");
      }}
    >
      Archive
    </button>
  );
}
