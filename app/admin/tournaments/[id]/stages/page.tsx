import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NewStageForm from "@/components/admin/NewStageForm";
import WeekRowClient from "@/components/admin/WeekRow";
import DayRowClient from "@/components/admin/DayRow";
import NewStageForm from "@/components/admin/NewStageForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const tournamentId = params.id;

  const [{ data: tRow }, { data: stages }] = await Promise.all([
    supabaseAdmin
      .from("tournaments")
      .select("name")
      .eq("id", tournamentId)
      .single(),
    supabaseAdmin
      .from("stages")
      .select("id,name,order_index")
      .eq("tournament_id", tournamentId)
      .order("order_index", { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Stages — {tRow?.name ?? "Tournament"}
        </h1>
        <Link href="/admin/tournaments" className="underline text-sm">
          ← Back to tournaments
        </Link>
      </div>

      {/* New Stage form */}
      <NewStageForm tournamentId={tournamentId} />

      {/* For each stage, show weeks + days management */}
      {stages?.map((stage: any) => (
        <StageBlock key={stage.id} stage={stage} />
      ))}
    </div>
  );
}

async function StageBlock({ stage }: { stage: any }) {
  // server fetch weeks and days for this stage
  const [{ data: weeks }, { data: days }] = await Promise.all([
    supabaseAdmin
      .from("weeks")
      .select("id,name,order_index")
      .eq("stage_id", stage.id)
      .order("order_index", { ascending: true }),
    supabaseAdmin
      .from("days")
      .select("id,name,date,order_index,week_id")
      .eq("stage_id", stage.id)
      .order("order_index", { ascending: true }),
  ]);

  return (
    <div key={stage.id} className="border rounded p-4 mb-4">
      <h2 className="font-semibold">{stage.name}</h2>

      <div className="mt-4">
        <h3 className="font-medium">Weeks</h3>
        <ul className="divide-y border rounded mt-2">
          {(weeks || []).map((w: any) => (
            <li key={w.id} className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{w.name}</strong>
                </div>
                <div className="flex gap-2">
                  {/* Client-side row for editing/deleting */}
                  {/* pass minimal week object */}
                  {/* @ts-ignore */}
                  <WeekRowClient
                    week={{
                      id: w.id,
                      title: w.name,
                      order_index: w.order_index,
                    }}
                  />
                </div>
              </div>
              {/* show days under this week */}
              <ul className="mt-2 ml-6 divide-y border rounded">
                {(days || [])
                  .filter((d: any) => d.week_id === w.id)
                  .map((d: any) => (
                    <li key={d.id} className="p-2">
                      {/* @ts-ignore */}
                      <DayRowClient
                        day={{
                          id: d.id,
                          title: d.name ?? d.date,
                          date: d.date,
                          order_index: d.order_index,
                          week_id: d.week_id,
                        }}
                      />
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <h3 className="font-medium">Days (unassigned to weeks)</h3>
          <ul className="divide-y border rounded mt-2">
            {(days || [])
              .filter((d: any) => !d.week_id)
              .map((d: any) => (
                <li key={d.id} className="p-2">
                  {/* @ts-ignore */}
                  <DayRowClient
                    day={{
                      id: d.id,
                      title: d.name ?? d.date,
                      date: d.date,
                      order_index: d.order_index,
                      week_id: d.week_id,
                    }}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
