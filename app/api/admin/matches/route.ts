import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED = new Set(["planned", "live", "completed"]);

export async function POST(req: Request) {
  const { stage_id, day_id, match_no, scheduled_at, status } = await req.json();

  if (!stage_id || !match_no) {
    return NextResponse.json(
      { error: "stage_id & match_no required" },
      { status: 400 }
    );
  }

  const cleanStatus =
    typeof status === "string" && ALLOWED.has(status.trim())
      ? status.trim()
      : "planned";

  const { error } = await supabaseAdmin.from("matches").insert({
    stage_id,
    day_id: day_id || null, // optional hierarchy
    match_no: Number(match_no),
    scheduled_at: scheduled_at || null, // date-only is fine (DB will coerce)
    status: cleanStatus,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
