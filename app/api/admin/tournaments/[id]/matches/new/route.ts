import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const { stage_id, day_id, match_no, scheduled_at, status } = body;
  const payload: any = {
    stage_id,
    match_no,
    status: status ?? "planned",
    scheduled_at: scheduled_at ?? null,
    day_id: day_id ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from("matches")
    .insert([payload])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
