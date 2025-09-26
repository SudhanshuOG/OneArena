import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type Ctx = {
  params: { slug: string; week_no: string; day_no: string; id: string };
};

export async function POST(_req: Request, { params }: Ctx) {
  const { slug, week_no, day_no, id } = params;
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.redirect(
    new URL(
      `/tournament/${slug}/weeks/${week_no}/days/${day_no}/matches`,
      _req.url
    ),
    { status: 302 }
  );
}
