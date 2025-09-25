import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type Params = { params: { id: string } };

export async function POST(_: Request, { params }: Params) {
  const { id } = params;
  const { error } = await supabase.from("weeks").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.redirect(
    new URL("/tournament", process.env.NEXT_PUBLIC_SITE_URL)
  );
}
