// =============================
// app/api/clients/route.ts
// =============================
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { getClientsForCurrentUser } from '@/lib/services/clients/clients.service';
import { createClient } from '@/lib/services/clients/create-client';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ You can now use the user ID
    const clients = await getClientsForCurrentUser(user.id);

    console.log('Clients from service:', clients);

    return NextResponse.json(clients);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await createClient(body);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Create Client Error:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
