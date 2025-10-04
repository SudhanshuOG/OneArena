import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // ya: "../../../../lib/supabaseAdmin"

// PATCH = update stage
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const updates: any = {};

  if (typeof body.name === "string") updates.name = body.name;
  if (body.order_index !== undefined) {
    const n = Number(body.order_index);
    updates.order_index = Number.isFinite(n) ? n : 1;
  }

  const { error } = await supabaseAdmin
    .from("stages")
    .update(updates)
    .eq("id", params.id);

  if (error) {
    console.error("Stage PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// DELETE = delete stage
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("stages")
    .delete()
    .eq("id", params.id);

  if (error) {
    console.error("Stage DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
