// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { upsertGoogleEvent, deleteGoogleEvent } from "@/lib/googleSync";

export const dynamic = "force-dynamic"; // avoids any static caching for safety

// GET /api/appointments/:id  -> read one
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ appt: data });
}

// PATCH /api/appointments/:id  -> update/reschedule
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const { data: appt, error } = await supabaseAdmin
    .from("appointments")
    .update({
      title: body.title,
      notes: body.notes,
      location: body.location,
      start_at: body.startISO,
      end_at: body.endISO,
      time_zone: body.timeZone,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

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
      remindersMins: [30],
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Updated, but Google sync failed", details: String(e), appt },
      { status: 502 }
    );
  }

  return NextResponse.json({ appt });
}

// DELETE /api/appointments/:id  -> cancel/delete
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: appt } = await supabaseAdmin
    .from("appointments")
    .select("id, staff_user_id")
    .eq("id", params.id)
    .single();

  await supabaseAdmin
    .from("appointments")
    .update({ status: "CANCELLED", cancelled_at: new Date().toISOString() })
    .eq("id", params.id);

  if (appt) {
    try {
      await deleteGoogleEvent(appt.id, appt.staff_user_id);
    } catch (e: any) {
      return NextResponse.json(
        { error: "Cancelled, but Google delete failed", details: String(e) },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
