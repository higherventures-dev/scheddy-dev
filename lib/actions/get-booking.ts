"use server";

import { dayjs } from "#/lib/dayjs";
import { db } from "#/lib/db";
import { z } from "zod";

const schema = z.object({
	bookingId: z.number(),
});

export const getBooking = async (data: z.input<typeof schema>) => {
	const { bookingId } = schema.parse(data);

	const booking = await db.query.bookings.findFirst({
		columns: {
			id: true,
			employeeId: true,
			startTime: true,
			endTime: true,
			confirmedAt: true,
			cancelledAt: true,
			createdAt: true,
		},
		where: (T, { eq }) => eq(T.id, bookingId),
		with: {
			customer: {
				with: {
					profile: {
						columns: { givenName: true, familyName: true },
					},
				},
			},
			profile: {
				columns: { givenName: true, familyName: true },
			},
		},
	});

	if (!booking) {
		throw new Error("ERR_GET_BOOKING_NOT_FOUND");
	}

	const { createdAt, cancelledAt, confirmedAt, startTime, endTime, customer } =
		booking;

	return {
		booking: {
			createdAt: dayjs(createdAt).toISOString(),
			createdBy: "David S.",
		},
		customer: {
			email: "andrew.higgins23@gmail.com",
			familyName: customer?.profile?.familyName,
			givenName: customer?.profile?.givenName,
			notes:
				"Davis has a sensitive skin. Apply necessary skincare products before starting a session",
			phone: "909-254-7063",
		},
		employee: {
			givenName: "Michael",
			familyName: "Johnson",
			avatar: "https://placehold.co/40x40.png",
			role: "Senior Tattoo Artist",
		},
		event: {
			id: 1,
			summary: "Continuing session",
			start: dayjs(startTime).toISOString(),
			end: dayjs(endTime).toISOString(),
			status: cancelledAt
				? "cancelled"
				: confirmedAt
					? "confirmed"
					: "tentative",
		},
		payment: {
			owed: 120,
			price: 120,
		},
	};
};
