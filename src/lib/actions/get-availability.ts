"use server";

import type { Dayjs } from "@/lib/dayjs";
import { db } from "@/lib/db";

export const getAvailability = async ({
	businessId,
	serviceId,
	employeeId,
	day,
}: {
	businessId: string;
	serviceId: number;
	day: Dayjs;
	employeeId?: number;
}) => {
	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
			timezone: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!business) {
		throw new Error("ERR_GET_AVAILABILITY_BUSINESS_NOT_FOUND");
	}

	const inTz = day.tz(business.timezone);

	const employees = await db.query.employees.findMany({
		columns: {
			id: true,
		},
		where: (T, { and, eq }) =>
			and(
				employeeId ? eq(T.id, employeeId) : undefined,
				eq(T.businessId, business.id),
			),
		with: {
			bookings: {
				columns: {
					startTime: true,
					endTime: true,
				},
				where: (T, { between }) =>
					between(
						T.startTime,
						inTz.startOf("day").toDate(),
						inTz.endOf("day").toDate(),
					),
			},
		},
	});

	const availableTimes = await db.query.schedule.findMany({
		columns: {
			employeeId: true,
			minutesFromStart: true,
		},
		where: (T, { and, eq }) =>
			and(eq(T.weekday, inTz.day()), eq(T.serviceId, serviceId)),
	});

	const availableHours = [];

	for (const { id, bookings } of employees) {
		const times = availableTimes.filter(({ minutesFromStart }) => {
			const time = inTz.startOf("day").add(minutesFromStart);

			return (
				employeeId === id &&
				bookings.every(
					({ startTime, endTime }) =>
						time.isBefore(startTime) || time.isAfter(endTime),
				)
			);
		});

		for (const { employeeId, minutesFromStart } of times) {
			availableHours.push({
				employeeId,
				time: inTz.startOf("day").add(minutesFromStart),
			});
		}
	}

	return availableHours;
};
