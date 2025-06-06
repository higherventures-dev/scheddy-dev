"use server";

import { db } from "#/lib/db";

export const getBusinessInformation = async (id: string) => {
	const business = await db.query.businesses.findFirst({
		columns: {
			uuid: true,
			slug: true,
			logo: true,
			displayName: true,
			address: true,
			phone: true,
			email: true,
		},
		where: (T, { eq, or }) => or(eq(T.uuid, id), eq(T.slug, id)),
	});

	if (!business) {
		throw new Error("Business not found");
	}

	return business;
};

export type BusinessInformation = NonNullable<
	Awaited<ReturnType<typeof getBusinessInformation>>
>;
