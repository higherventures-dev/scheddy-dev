"use server";

import { db } from "#/lib/db";
import { pick } from "lodash-es";

export const getBusinessServices = async (id: string) => {
	const business = await db.query.businesses.findFirst({
		columns: {},
		where: (T, { eq, or }) => or(eq(T.uuid, id), eq(T.slug, id)),
		with: {
			categories: {
				columns: {
					id: true,
					name: true,
				},
				orderBy: (T, { asc }) => asc(T.order),
				with: {
					services: {
						columns: {
							serviceId: true,
						},
						orderBy: (T, { asc }) => asc(T.order),
					},
				},
			},
			services: {
				columns: {
					id: true,
					uuid: true,
					name: true,
					description: true,
					price: true,
					duration: true,
					prepareTime: true,
					cleanupTime: true,
				},
			},
		},
	});

	if (!business) {
		throw new Error("Business not found");
	}

	return {
		...pick(business, "services"),
		categories: business.categories.map((category) => ({
			...category,
			services: category.services.map(({ serviceId }) => serviceId),
		})),
	};
};

export type BusinessServices = Awaited<ReturnType<typeof getBusinessServices>>;
