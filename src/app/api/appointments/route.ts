import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleEvent } from "@/lib/googleSync";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // expected: { title, notes, location, startISO, endISO, timeZone, staff_user_id, customer_email }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // 1) create appointment in DB
  const { data: appt, error } = await supabase
    .from("appointments")
    .insert({
      title: body.title,
      notes: body.notes ?? null,
      location: body.location ?? null,
      start_at: body.startISO,     // your schema may be timestamptz
      end_at: body.endISO,
      time_zone: body.timeZone,    // if you store it
      staff_user_id: body.staff_user_id,
      customer_email: body.customer_email ?? null,
      status: "BOOKED",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // 2) push to Google immediately (strict)
  try {
    await upsertGoogleEvent({
      appt_id: appt.id,
      user_id: appt.staff_user_id,
      title: appt.title,
      description: appt.notes ?? "",
      location: appt.location ?? "",
      startISO: appt.start_at,
      endISO: appt.end_at,
      timeZone: appt.time_zone ?? "America/Los_Angeles",
      attendees: appt.customer_email ? [{ email: appt.customer_email }] : [],
      remindersMins: [30, 10],
    });
  } catch (e: any) {
    // Optional: enqueue retry instead of failing the booking
    // await supabase.from("google_sync_queue").insert({
    //   appt_id: appt.id, user_id: appt.staff_user_id, action: "UPSERT",
    //   payload: appt, last_error: String(e)
    // });
    return NextResponse.json({ error: "Booked, but Google sync failed", details: String(e), appt }, { status: 502 });
  }

  return NextResponse.json({ appt }, { status: 201 });
}
