// =============================
// app/api/clients/[id]/route.ts (PUT)
// =============================

import { NextResponse } from 'next/server';
import { updateClient } from '@/lib/services/clients/update-client';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const client = await updateClient(params.id, body);
    return NextResponse.json(client);
  } catch (error) {
    console.error('Update Client Error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
