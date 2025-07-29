

// =============================
// services/clients/create-client.ts
// =============================

import { db } from '@/lib/db';

export async function createClient(data: {
  name: string;
  email?: string;
  phone?: string;
}) {
  const { name, email, phone } = data;
  const result = await db.client.create({
    data: {
      name,
      email,
      phone,
    },
  });
  return result;
}
