import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dayId = params.id;
  const body = await req.json().catch(() => ({}));
  const update: any = {};
  if (body.title !== undefined) update.name = body.title;
  if (body.date !== undefined) update.date = body.date;
  if (body.order_index !== undefined) update.order_index = body.order_index;
  if (body.week_id !== undefined) update.week_id = body.week_id;

  const { error } = await supabaseAdmin
    .from("days")
    .update(update)
    .eq("id", dayId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const dayId = params.id;
  const { error } = await supabaseAdmin.from("days").delete().eq("id", dayId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
