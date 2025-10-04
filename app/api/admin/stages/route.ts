import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // ya: "../../../lib/supabaseAdmin"

export async function POST(req: Request) {
  const { tournament_id, name, order_index } = await req.json();

  if (!tournament_id || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("stages")
    .insert({ tournament_id, name, order_index: Number(order_index) || 1 });

  if (error) {
    console.error("Stage POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
