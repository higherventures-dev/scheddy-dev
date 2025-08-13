import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { L } from 'vitest/dist/chunks/reporters.d.BFLkQcL6'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    const { data: summary, error: summaryError } = await supabase.rpc(
      'booking_summary_for_client',
      { p_client_id: id })
      .single();
    
    console.log("SUMMARY DATA", summary)
    console.log("SUMMARY ERROR", summaryError)

    if (summaryError) {
      return NextResponse.json({ error: summaryError.message }, { status: 500 })
    }

    const response = {
  profile,
  summary: summary || {
    client_id: id,
    total_bookings: 0,
    total_revenue: 0,
    total_no_shows: 0,
    total_canceled: 0,
  },
};

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("API ERROR:", error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
