import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/** Update match (Edit form) */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const { match_no, status, scheduled_at, stage_id } = body as {
    match_no?: number;
    status?: string;
    scheduled_at?: string | null;
    stage_id?: string;
  };

  const { error } = await supabaseAdmin
    .from("matches")
    .update({
      ...(match_no !== undefined ? { match_no } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(scheduled_at !== undefined ? { scheduled_at } : {}),
      ...(stage_id ? { stage_id } : {}),
    })
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Hard delete (Delete Forever) */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("matches")
    .delete()
    .eq("id", params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
