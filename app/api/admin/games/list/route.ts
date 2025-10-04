import { NextResponse } from "next/server";
// alias chale to ye:
import { supabaseAdmin } from "@/lib/supabaseAdmin";
// agar alias na chale to relative:
/// import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("games")
    .select("id,name")
    .order("name");
  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}
