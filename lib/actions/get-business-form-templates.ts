"use server";

import { db } from "@/lib/db";

export const getBusinessFormTemplates = async (id: string) => {
	const business = await db.query.businesses.findFirst({
		columns: {},
		where: (T, { eq, or }) => or(eq(T.uuid, id), eq(T.slug, id)),
		with: {
			forms: {
				columns: {
					id: true,
					title: true,
					updatedAt: true,
				},
			},
		},
	});

	if (!business) {
		throw new Error("Business not found");
	}

	return business.forms;
};

export type BusinessFormTemplates = Awaited<
	ReturnType<typeof getBusinessFormTemplates>
>;
