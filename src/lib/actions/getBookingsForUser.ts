'use server'

import { getBookingsForUserService } from '@/features/bookings/services/getBookingsForUserService'

export async function getBookingsForUser(input: Parameters<typeof getBookingsForUserService>[0]) {
  return await getBookingsForUserService(input)
}