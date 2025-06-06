"use server";

import { db } from "#/lib/db";

export const getBusinessEmployees = async (businessId: string) => {
	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
		with: {
			employees: {
				columns: { id: true, role: true, avatar: true },
				with: {
					profile: {
						columns: { givenName: true, familyName: true },
					},
				},
			},
		},
	});

	if (!business) {
		throw new Error("Business not found");
	}

	return business.employees.map(({ profile, ...employee }) => ({
		...employee,
		...profile,
	}));
};
