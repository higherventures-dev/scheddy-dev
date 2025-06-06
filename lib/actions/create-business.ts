"use server";

import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { getUser, uploadImage } from "#/lib/supabase";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
	logo: z
		.custom<File>()
		.optional()
		.refine((file) => !file || file.size <= 6 * 1024 * 1024, {
			message: "The logo must be a maximum of 6MB.",
		})
		.refine((file) => !file || file.type?.startsWith("image"), {
			message: "Only images are allowed to be sent.",
		}),
	displayName: z.string(),
	website: z.string().optional(),
});

export const createBusiness = async (data: FormData) => {
	const { user } = await getUser();
	if (!user) {
		throw new Error("ERR_CREATE_BUSINESS_NO_USER");
	}

	const { logo, displayName, website } = schema.parse({
		logo: data.get("logo"),
		displayName: data.get("displayName"),
		website: data.get("website"),
	});

	const owner = await db.query.profiles.findFirst({
		columns: { id: true },
		where: (T, { eq }) => eq(T.userId, user.id),
		with: {
			employment: {
				columns: { id: true },
			},
		},
	});

	if (!owner) {
		throw new Error("ERR_CREATE_BUSINESS_NO_OWNER_PROFILE");
	}

	const business = await db.transaction(async (tx) => {
		const [{ id, uuid }] = await tx
			.insert(S.businesses)
			.values({
				displayName,
				website,
				ownerId: owner.id,
				timezone: "America/Los_Angeles",
			})
			.returning({ id: S.businesses.id, uuid: S.businesses.uuid });

		await tx.insert(S.employees).values({
			businessId: id,
			profileId: owner.id,
			role: "Owner",
		});

		if (logo) {
			const objectKey = `logos/${uuid}.png`;
			const publicUrl = await uploadImage(objectKey, logo);

			await tx
				.update(S.businesses)
				.set({ logo: publicUrl })
				.where(eq(S.businesses.uuid, uuid));
		}

		return { uuid };
	});

	return business;
};
