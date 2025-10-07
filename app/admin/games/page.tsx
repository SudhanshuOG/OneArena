"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Game = {
  id: string | number;
  name: string;
  slug: string | null;
  alias?: string | null; // optional (nullable in DB)
};

const slugify = (s: string) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function GamesAdmin() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAlias, setNewAlias] = useState("");

  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    setLoading(true);
    setErrMsg(null);
    const { data, error } = await supabase
      .from("games")
      .select("id, name, slug, alias")
      .order("name", { ascending: true });

    if (error) setErrMsg(error.message);
    setGames(data || []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      setErrMsg("Name is required");
      return;
    }
    setErrMsg(null);

    const payload: any = { name, slug: slugify(name) };
    if (newAlias.trim()) payload.alias = newAlias.trim();

    const { error } = await supabase.from("games").insert(payload);
    if (error) {
      setErrMsg(error.message);
      return;
    }

    setNewName("");
    setNewAlias("");
    setAdding(false);
    await fetchGames();
  }

  function startEdit(g: Game) {
    setEditingGame({ ...g });
  }
  function cancelEdit() {
    setEditingGame(null);
  }

  async function saveEdit() {
    if (!editingGame) return;
    const { id, name } = editingGame;
    if (!name?.trim()) {
      setErrMsg("Name cannot be empty");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("games")
      .update({
        name: name.trim(),
        slug: slugify(name),
        alias: (editingGame as any).alias?.toString().trim() || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
    setEditingGame(null);
    await fetchGames();
  }

  async function handleDelete(id: string | number, name: string) {
    if (!confirm(`Delete "${name}" permanently?`)) return;
    setDeletingId(id);
    const { error } = await supabase.from("games").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      setErrMsg(error.message);
      return;
    }
    await fetchGames();
  }

  if (loading) return <div className="p-6 text-white">Loading games...</div>;

  return (
    <div className="p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Games</h1>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="px-3 py-1 rounded border border-neutral-600 hover:bg-neutral-800"
            >
              + New
            </button>
          )}
        </div>

        {errMsg && (
          <div className="text-red-400 text-sm mb-3 border border-red-500 p-2 rounded">
            Error: {errMsg}
          </div>
        )}

        {/* Create Form */}
        {adding && (
          <form
            onSubmit={handleCreate}
            className="mb-4 bg-neutral-900 border border-neutral-700 rounded p-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Name
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
                  placeholder="e.g. BGMI"
                />
              </label>
              <label className="text-sm">
                Alias (optional)
                <input
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
                  placeholder="e.g. Battle Royale Mobile"
                />
              </label>
            </div>

            <div className="flex gap-2 justify-end mt-3">
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                  setNewAlias("");
                }}
                className="px-4 py-2 rounded border border-neutral-600 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {games.length === 0 && <div>No games found.</div>}
          {games.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded p-3"
            >
              <div>
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-neutral-400">
                  {g.alias || g.slug}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(g)}
                  className="px-3 py-1 rounded border border-neutral-600 hover:bg-neutral-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(g.id, g.name)}
                  disabled={deletingId === g.id}
                  className={`px-3 py-1 rounded border ${
                    deletingId === g.id
                      ? "opacity-50"
                      : "border-red-500 hover:bg-red-700"
                  }`}
                >
                  {deletingId === g.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md p-5">
              <h2 className="text-lg font-semibold mb-3">Edit Game</h2>

              <label className="block text-sm mb-2">
                Name
                <input
                  value={editingGame.name}
                  onChange={(e) =>
                    setEditingGame({ ...editingGame, name: e.target.value })
                  }
                  className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
                />
              </label>

              <label className="block text-sm mb-4">
                Alias (optional)
                <input
                  value={(editingGame as any).alias || ""}
                  onChange={(e) =>
                    setEditingGame({
                      ...editingGame,
                      alias: e.target.value as any,
                    })
                  }
                  className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
                />
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded border border-neutral-600 hover:bg-neutral-800"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
