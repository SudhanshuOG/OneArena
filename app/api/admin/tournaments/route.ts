import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
// relative fallback:
// import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  const payload = await req.json();
  const { error } = await supabaseAdmin.from("tournaments").insert(payload);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
