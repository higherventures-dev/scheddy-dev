"use server";

import { db } from "#/lib/db";

export const getBusinessCustomers = async (businessId: string) => {
	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
		with: {
			customers: {
				columns: { uuid: true },
				with: {
					profile: {
						columns: {
							email: true,
							familyName: true,
							givenName: true,
							phone: true,
						},
					},
				},
			},
		},
	});

	if (!business) {
		throw new Error("ERR_GET_BUSINESS_CUSTOMERS_BUSINESS_NOT_FOUND");
	}

	return business.customers.map(({ uuid, profile }) => ({
		id: uuid,
		...profile,
	}));
};
