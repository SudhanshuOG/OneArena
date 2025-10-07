import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(
  req: Request,
  { params }: { params: { matchId: string } }
) {
  const { results } = await req.json(); // [{team_id, placement, kills, points}]
  const match_id = params.matchId;

  // Simple replace: delete old then insert new (safe for admin)
  const del = await supabaseAdmin
    .from("match_results")
    .delete()
    .eq("match_id", match_id);
  if (del.error)
    return NextResponse.json({ error: del.error.message }, { status: 400 });

  if (Array.isArray(results) && results.length > 0) {
    const cleaned = results.map((r: any) => ({
      match_id,
      team_id: r.team_id,
      placement: Number(r.placement) || 0,
      kills: Number(r.kills) || 0,
      points: Number(r.points) || 0,
    }));
    const ins = await supabaseAdmin.from("match_results").insert(cleaned);
    if (ins.error)
      return NextResponse.json({ error: ins.error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
