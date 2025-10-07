import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { stage_id, name, order_index } = await req.json();
  if (!stage_id || !name)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const { error } = await supabaseAdmin.from("weeks").insert({
    stage_id,
    name,
    order_index: Number(order_index) || 1,
  });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
