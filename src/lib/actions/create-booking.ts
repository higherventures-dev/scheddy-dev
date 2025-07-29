"use server";

import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { getUser } from "#/lib/supabase";
import { z } from "zod";
import { schema } from "./create-booking.schema";

export const createBooking = async (data: z.input<typeof schema>) => {
	const { user, error } = await getUser();

	if (error) {
		throw error;
	}

	if (!user) {
		throw new Error("ERR_CREATE_BOOKING_USER_NOT_FOUND");
	}

	const { businessId, comments, serviceId, time } = schema.parse(data);

	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
			timezone: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
		with: {
			services: {
				columns: {
					price: true,
					duration: true,
				},
				where: (T, { eq }) => eq(T.id, serviceId),
				with: {
					schedule: {
						columns: {
							minutesFromStart: true,
						},
					},
				},
			},
		},
	});

	if (!business) {
		throw new Error("ERR_CREATE_BOOKING_BUSINESS_NOT_FOUND");
	}

	const { services, timezone } = business;

	if (services.length === 0) {
		throw new Error("ERR_CREATE_BOOKING_SERVICE_NOT_FOUND");
	}

	const { price, duration, schedule } = services[0];

	const dayStart = time.tz(timezone).startOf("day");
	const delta = time.diff(dayStart, "minutes");

	if (!schedule.some(({ minutesFromStart }) => minutesFromStart === delta)) {
		throw new Error("ERR_CREATE_BOOKING_TIME_NOT_AVAILABLE");
	}

	const profile = await db.query.profiles.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq }) => eq(T.userId, user.id),
	});

	if (!profile) {
		throw new Error("ERR_CREATE_BOOKING_PROFILE_NOT_FOUND");
	}

	const booking = await db.transaction(async (tx) => {
		let customer = await tx.query.customers.findFirst({
			columns: {
				id: true,
			},
			where: (T, { eq }) => eq(T.profileId, profile.id),
		});

		if (!customer) {
			const [{ id }] = await tx
				.insert(S.customers)
				.values({
					businessId: business.id,
					profileId: profile.id,
				})
				.returning({ id: S.customers.id });

			customer = { id };
		}

		const [booking] = await tx
			.insert(S.bookings)
			.values({
				customerId: customer.id,
				profileId: profile.id,
				serviceId,
				startTime: time.toDate(),
				endTime: time.add(duration, "minutes").toDate(),
				price,
				comments,
			})
			.returning({ id: S.bookings.id });

		return booking;
	});

	return booking;
};
