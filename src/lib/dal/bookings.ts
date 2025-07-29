// /lib/dal/bookings.ts
import { db } from '@/lib/db'

export async function getBusinessTimezone(businessId: string) {
  return await db.query.businesses.findFirst({
    columns: { id: true, timezone: true },
    where: (T, { eq, or }) => or(eq(T.uuid, businessId), eq(T.slug, businessId)),
  });
}

export async function getEmployeeBookings(employeeIds?: number[]) {
  return await db.query.employees.findMany({
    columns: { id: true },
    where: employeeIds
      ? (employees, { inArray }) => inArray(employees.id, employeeIds)
      : undefined,
    with: {
      bookings: {
        columns: {
          id: true,
          startTime: true,
          endTime: true,
          confirmedAt: true,
          cancelledAt: true,
        },
        with: {
          profile: {
            columns: { givenName: true, familyName: true },
          },
        },
      },
    },
  });
}
