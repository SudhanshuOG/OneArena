"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGame() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin/games");
    else alert("Failed to create");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-semibold">New Game</h1>
      <div>
        <label className="block text-sm">Name</label>
        <input
          className="border px-3 py-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm">Slug</label>
        <input
          className="border px-3 py-2 rounded w-full"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <button disabled={loading} className="px-3 py-2 border rounded">
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
