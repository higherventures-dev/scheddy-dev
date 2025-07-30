import type { EventInput } from "#@/lib/components/calendar/schema";
import { dayjs } from "@/lib/dayjs";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
	businessId: z.string(),
	employeeIds: z.array(z.number()).optional(),
	from: z
		.string()
		.date()
		.transform((arg) => dayjs(arg)),
	to: z
		.string()
		.date()
		.transform((arg) => dayjs(arg)),
});

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const { businessId, employeeIds, from, to } = schema.parse({
		businessId: searchParams.get("businessId"),
		employeeIds: searchParams.getAll("employeeId").map(Number),
		from: searchParams.get("from"),
		to: searchParams.get("to"),
	});

	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
			timezone: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!business) {
		throw new Error("ERR_GET_BOOKINGS_BUSINESS_NOT_FOUND");
	}

	const employees = await db.query.employees.findMany({
		columns: {
			id: true,
		},
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
				where: (bookings, { and, gte, lte }) =>
					and(
						gte(
							bookings.endTime,
							from.tz(business.timezone).startOf("day").toDate(),
						),
						lte(
							bookings.startTime,
							to.tz(business.timezone).endOf("day").toDate(),
						),
					),
				with: {
					profile: {
						columns: { givenName: true, familyName: true },
					},
				},
			},
		},
	});

	return Response.json(
		employees.flatMap(({ id: employeeId, bookings }) =>
			bookings.map(
				({
					id,
					cancelledAt,
					confirmedAt,
					startTime,
					endTime,
					profile,
				}): EventInput => ({
					id,
					employeeId,
					status: cancelledAt
						? "cancelled"
						: confirmedAt
							? "confirmed"
							: "tentative",
					start: {
						date: dayjs(startTime).format("YYYY-MM-DD"),
						dateTime: dayjs(startTime).toISOString(),
					},
					end: {
						date: dayjs(endTime).format("YYYY-MM-DD"),
						dateTime: dayjs(endTime).toISOString(),
					},
					summary: `${profile?.givenName} ${profile?.familyName}`,
				}),
			),
		),
	);
};
