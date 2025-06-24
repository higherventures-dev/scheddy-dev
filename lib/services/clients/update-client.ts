// =============================
// services/clients/update-client.ts
// =============================

import { db } from '@/lib/db';

export async function updateClient(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
  }
) {
  const result = await db.client.update({
    where: { id },
    data,
  });
  return result;
}
