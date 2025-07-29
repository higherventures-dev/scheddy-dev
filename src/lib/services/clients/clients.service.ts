// =============================
// lib/services/clients.service.ts
// =============================

import { getUser } from '@/lib/auth/getUserFromSession';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { getClients } from '@/lib/data/clients/get-clients';
import { getClientsCreatedBy } from '@/lib/data/clients/get-clients-created-by';
import { getClientsForBusiness } from '@/lib/data/clients/get-clients-for-business';
import { createClient } from '@/lib/data/clients/create-client';
import { updateClient } from '@/lib/data/clients/update-client';
import { deleteClient } from '@/lib/data/clients/delete-client';

export async function getClientsForCurrentUser() {
  const supabase = createServerComponentClient({ cookies });
  const user = await getUser();
  const role = user.user_metadata?.role;
  console.log('User role:', role);

  if (role === 'admin') {
    const { data } = await getClients(supabase, user.id);
    console.log('All clients (admin):', data);
    if (error) console.error('❌ Error fetching all clients:', error);
    return data || [];
  }

  if (role === 'studio') {
    const { data } = await getClientsForBusiness(supabase, user.id);
    return data || [];
  }

  if (role === 'artist') {
    const { data } = await getClientsCreatedBy(supabase, user.id);
    return data || [];
  }

  throw new Error('Unauthorized role');
}

export async function createClientForUser(data: any) {
  const supabase = createServerComponentClient({ cookies });
  const user = await getUser();
  return await createClient(supabase, user, data);
}

export async function updateClientForUser(clientId: string, data: any) {
  const supabase = createServerComponentClient({ cookies });
  return await updateClient(supabase, clientId, data);
}

export async function deleteClientForUser(clientId: string) {
  const supabase = createServerComponentClient({ cookies });
  return await deleteClient(supabase, clientId);
}
