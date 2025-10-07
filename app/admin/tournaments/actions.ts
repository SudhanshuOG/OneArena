"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

/** Update tournament (Edit dialog) */
export async function updateTournament(
  id: string,
  payload: {
    name: string;
    slug: string;
    status: "upcoming" | "ongoing" | "completed" | "planned";
    start_date: string | null;
    end_date: string | null;
    game_id: string;
  }
) {
  const { error } = await supabaseAdmin
    .from("tournaments")
    .update({
      name: payload.name,
      slug: payload.slug,
      status: payload.status,
      start_date: payload.start_date,
      end_date: payload.end_date,
      game_id: payload.game_id,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/tournaments");
  return { ok: true };
}

/** Soft delete = archive (sets deleted_at) */
export async function softDeleteTournament(id: string) {
  const { error } = await supabaseAdmin
    .from("tournaments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/tournaments");
  return { ok: true };
}

/** Restore from archive */
export async function restoreTournament(id: string) {
  const { error } = await supabaseAdmin
    .from("tournaments")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/tournaments");
  return { ok: true };
}

/** Hard delete (permanent) */
export async function hardDeleteTournament(id: string) {
  // ⚠️ If FKs don't have ON DELETE CASCADE, delete children first.
  const { error } = await supabaseAdmin
    .from("tournaments")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/tournaments");
  return { ok: true };
}
