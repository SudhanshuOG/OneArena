"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Team = {
  id: string;
  name: string;
  short_name?: string;
  games?: { name?: string };
};

export default function TeamRow({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [shortName, setShortName] = useState(team.short_name || "");
  const [pending, start] = useTransition();
  const router = useRouter();

  const save = () =>
    start(async () => {
      const res = await fetch(`/api/admin/teams/${team.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, short_name: shortName }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert("Save failed: " + (j?.error || res.status));
        return;
      }
      router.refresh();
    });

  const del = () =>
    start(async () => {
      if (!confirm("Delete this team?")) return;
      const res = await fetch(`/api/admin/teams/${team.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert("Delete failed: " + (j?.error || res.status));
        return;
      }
      router.refresh();
    });

  return (
    <li className="p-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <input
          className="border px-2 py-1 rounded min-w-64"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded w-28"
          placeholder="Short"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
        />
        <span className="text-sm text-gray-500">— {team.games?.name}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={pending}
          className="border px-2 py-1 rounded text-sm"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={del}
          disabled={pending}
          className="border px-2 py-1 rounded text-sm text-red-500"
        >
          {pending ? "…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
