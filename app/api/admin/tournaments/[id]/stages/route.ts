import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("stages")
    .select("id,name")
    .eq("tournament_id", params.id)
    .order("order_index");
  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}
