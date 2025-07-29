"use server";

import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { and, between, eq, inArray, max, sql } from "drizzle-orm";
import { z } from "zod";
import {
	createServiceSchema,
	deleteServiceSchema,
	moveServiceSchema,
} from "./services.schema";

export const createService = async (
	data: z.input<typeof createServiceSchema>,
) => {
	const { businessId, categoryIds, ...service } =
		createServiceSchema.parse(data);

	const result = await db.query.businesses.findFirst({
		columns: {
			id: true,
		},
		with: {
			categories: {
				columns: {
					id: true,
				},
				where: (T, { inArray }) => inArray(T.id, categoryIds),
			},
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!result) {
		throw new Error("ERR_CREATE_SERVICE_BUSINESS_NOT_FOUND");
	}

	if (result.categories.length === 0) {
		throw new Error("ERR_CREATE_SERVICE_CATEGORY_NOT_FOUND");
	}

	const categories = await db
		.select({
			categoryId: S.categories.id,
			order: max(S.servicesToCategories.order),
		})
		.from(S.categories)
		.leftJoin(
			S.servicesToCategories,
			eq(S.categories.id, S.servicesToCategories.categoryId),
		)
		.where(inArray(S.categories.id, categoryIds))
		.groupBy(S.categories.id);

	if (categories.length === 0) {
		throw new Error("ERR_CREATE_SERVICE_CATEGORY_NOT_FOUND");
	}

	const { id, uuid } = await db.transaction(async (tx) => {
		const [{ id, uuid }] = await tx
			.insert(S.services)
			.values({ businessId: result.id, ...service })
			.returning({ id: S.services.id, uuid: S.services.uuid });

		await tx.insert(S.servicesToCategories).values(
			categories.map(({ categoryId, order }) => ({
				categoryId,
				serviceId: id,
				order: (order ?? 0) + 1,
			})),
		);

		return { id, uuid };
	});

	return { id, uuid };
};

export const moveService = async (data: z.input<typeof moveServiceSchema>) => {
	const { businessId, categoryId, serviceId, fromIndex, toIndex } =
		moveServiceSchema.parse(data);

	if (fromIndex === toIndex) return;

	const result = await db.query.businesses.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!result) {
		throw new Error("ERR_MOVE_SERVICE_BUSINESS_NOT_FOUND");
	}

	await db.transaction(async (tx) => {
		if (fromIndex < toIndex) {
			await tx
				.update(S.servicesToCategories)
				.set({ order: sql`${S.servicesToCategories.order} - 1` })
				.where(
					and(
						eq(S.servicesToCategories.categoryId, categoryId),
						between(S.servicesToCategories.order, fromIndex + 1, toIndex),
					),
				);
		} else if (toIndex < fromIndex) {
			await tx
				.update(S.servicesToCategories)
				.set({ order: sql`${S.servicesToCategories.order} + 1` })
				.where(
					and(
						eq(S.servicesToCategories.categoryId, categoryId),
						between(S.servicesToCategories.order, toIndex, fromIndex - 1),
					),
				);
		}

		await tx
			.update(S.servicesToCategories)
			.set({ order: toIndex })
			.where(
				and(
					eq(S.servicesToCategories.categoryId, categoryId),
					eq(S.servicesToCategories.serviceId, serviceId),
				),
			);
	});
};

export const deleteService = async (
	data: z.input<typeof deleteServiceSchema>,
) => {
	const { id } = deleteServiceSchema.parse(data);

	const result = await db.query.services.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq }) => eq(T.id, id),
	});

	if (!result) {
		throw new Error("ERR_DELETE_SERVICE_SERVICE_NOT_FOUND");
	}

	await db.transaction(async (tx) => {
		await tx
			.delete(S.servicesToCategories)
			.where(eq(S.servicesToCategories.serviceId, id));

		await tx.delete(S.services).where(eq(S.services.id, id));
	});
};
