"use server";

import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getUser, uploadImage } from "../supabase";

const schema = z
	.object({
		logo: z
			.custom<File>()
			.refine((file) => !file || file.size <= 6 * 1024 * 1024, {
				message: "The logo must be a maximum of 6MB.",
			})
			.refine((file) => !file || file.type?.startsWith("image"), {
				message: "Only images are allowed to be sent.",
			}),
		displayName: z.string(),
		slug: z.string().nullable(),
		address: z.string().nullable(),
		phone: z.string().nullable(),
		email: z.string().nullable(),
	})
	.partial();

export type Inputs = z.input<typeof schema>;

export const updateBusinessBasicInformation = async (
	id: string,
	data: FormData,
) => {
	const { user } = await getUser();
	if (!user) {
		throw new Error("ERR_CREATE_BUSINESS_NO_USER");
	}

	const { logo, displayName, slug, address, email, phone } = schema.parse({
		logo: data.get("logo"),
		displayName: data.get("displayName"),
		slug: data.get("slug"),
		address: data.get("address"),
		phone: data.get("phone"),
		email: data.get("email"),
	});

	await db.transaction(async (tx) => {
		await tx
			.update(S.businesses)
			.set({
				displayName,
				slug,
				address,
				phone,
				email,
			})
			.where(eq(S.businesses.uuid, id));

		if (logo) {
			const objectKey = `logos/${id}.png`;
			const publicUrl = await uploadImage(objectKey, logo);

			await tx
				.update(S.businesses)
				.set({ logo: publicUrl })
				.where(eq(S.businesses.uuid, id));
		}
	});
};
