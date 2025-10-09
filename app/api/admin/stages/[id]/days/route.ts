import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function isIsoDateString(s: any) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const stageId = params.id;
  const { data, error } = await supabaseAdmin
    .from("days")
    .select("id, name, date, week_id, order_index")
    .eq("stage_id", stageId)
    .order("order_index", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (data || []).map((d) => ({
    id: d.id,
    title: d.name ?? (d.date ? d.date.toString() : "Day"),
    date: d.date,
    week_id: d.week_id,
    order_index: d.order_index,
  }));
  return NextResponse.json(mapped);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const stageId = params.id;
  const body = await req.json().catch(() => ({}));
  const { title, date, week_id, order_index } = body;

  const payload: any = {
    stage_id: stageId,
    week_id: week_id || null,
    order_index: order_index || 1,
  };

  if (date && isIsoDateString(date)) {
    payload.date = date;
    if (title) payload.name = title;
  } else if (title) {
    payload.name = title;
    payload.date = null; // allowed because we dropped NOT NULL earlier
  } else {
    payload.date = new Date().toISOString().split("T")[0];
  }

  const { data, error } = await supabaseAdmin
    .from("days")
    .insert([payload])
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
