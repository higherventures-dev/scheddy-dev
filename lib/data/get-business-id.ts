// lib/data/get-business-id.ts
import { getUser } from '../auth/get-user';

export async function getBusinessId() {
  const user = await getUser();

  // Option A: if stored in metadata
  const businessId = user?.user_metadata?.business_id;

  // Option B: lookup from database using user.id
  // const businessId = await queryDatabaseForBusinessId(user.id);

  if (!businessId) {
    throw new Error('No business ID found for user');
  }

  return businessId;
}