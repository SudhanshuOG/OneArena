import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const weekId = params.id;
  const body = await req.json().catch(() => ({}));
  const name = body.title || body.name;
  const order_index = body.order_index;

  const toUpdate: any = {};
  if (name !== undefined) toUpdate.name = name;
  if (order_index !== undefined) toUpdate.order_index = order_index;

  const { error } = await supabaseAdmin
    .from("weeks")
    .update(toUpdate)
    .eq("id", weekId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const weekId = params.id;
  // safe delete: remove days under this week OR set week_id null? We'll delete cascade days for cleanliness.
  // If you prefer soft-delete, change to update deleted_at column.
  const { error } = await supabaseAdmin
    .from("days")
    .delete()
    .eq("week_id", weekId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: err2 } = await supabaseAdmin
    .from("weeks")
    .delete()
    .eq("id", weekId);
  if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
