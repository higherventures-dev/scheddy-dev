"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
	customerId: z.string().uuid(),
});

export const getCustomer = async (data: z.input<typeof schema>) => {
	const { customerId } = schema.parse(data);

	const customer = await db.query.customers.findFirst({
		columns: {},
		where: (T, { eq }) => eq(T.uuid, customerId),
		with: {
			bookings: {
				columns: {
					id: true,
					startTime: true,
					endTime: true,
					price: true,
					cancelledAt: true,
				},
				with: {
					employee: {
						columns: {},
						with: {
							profile: {
								columns: {
									givenName: true,
									familyName: true,
								},
							},
						},
					},
				},
			},
			profile: {
				columns: {
					email: true,
					familyName: true,
					givenName: true,
					phone: true,
				},
			},
		},
	});

	if (!customer) {
		return null;
	}

	return {
		...customer,
		bookings: customer.bookings.map(
			({ startTime, endTime, cancelledAt, ...booking }) => ({
				...booking,
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				cancelledAt: cancelledAt != null ? cancelledAt.toISOString() : null,
			}),
		),
	};
};
