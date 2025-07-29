"use server";

import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { and, between, eq, max, sql } from "drizzle-orm";
import { isUndefined, omitBy } from "lodash-es";
import { z } from "zod";
import {
	createCategorySchema,
	deleteCategorySchema,
	moveCategorySchema,
	updateCategorySchema,
} from "./categories.schema";

export const createCategory = async (
	data: z.input<typeof createCategorySchema>,
) => {
	const { businessId, name } = createCategorySchema.parse(data);

	const result = await db.query.businesses.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!result) {
		throw new Error("ERR_CREATE_CATEGORY_BUSINESS_NOT_FOUND");
	}

	const [{ order }] = await db
		.select({ order: max(S.categories.order) })
		.from(S.categories)
		.where(eq(S.categories.businessId, result.id));

	const [{ id }] = await db
		.insert(S.categories)
		.values({
			businessId: result.id,
			name,
			order: (order ?? 0) + 1,
		})
		.returning({ id: S.bookings.id });

	return { id };
};

export const moveCategory = async (
	data: z.input<typeof moveCategorySchema>,
) => {
	const { businessId, categoryId, fromIndex, toIndex } =
		moveCategorySchema.parse(data);

	if (fromIndex === toIndex) return;

	const business = await db.query.businesses.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq, or }) =>
			or(eq(T.uuid, businessId), eq(T.slug, businessId)),
	});

	if (!business) {
		throw new Error("ERR_MOVE_CATEGORY_BUSINESS_NOT_FOUND");
	}

	await db.transaction(async (tx) => {
		if (fromIndex < toIndex) {
			await tx
				.update(S.categories)
				.set({ order: sql`${S.categories.order} - 1` })
				.where(
					and(
						eq(S.categories.businessId, business.id),
						between(S.categories.order, fromIndex + 1, toIndex),
					),
				);
		} else if (toIndex < fromIndex) {
			await tx
				.update(S.categories)
				.set({ order: sql`${S.categories.order} + 1` })
				.where(
					and(
						eq(S.categories.businessId, business.id),
						between(S.categories.order, toIndex, fromIndex - 1),
					),
				);
		}

		await tx
			.update(S.categories)
			.set({ order: toIndex })
			.where(
				and(
					eq(S.categories.businessId, business.id),
					eq(S.categories.id, categoryId),
				),
			);
	});
};

export const updateCategory = async (
	data: z.input<typeof updateCategorySchema>,
) => {
	const { id, ...delta } = updateCategorySchema.parse(data);

	const result = await db.query.categories.findFirst({
		columns: { id: true },
		where: (T, { eq }) => eq(T.id, id),
	});

	if (!result) {
		throw new Error("ERR_UPDATE_CATEGORY_CATEGORY_NOT_FOUND");
	}

	await db
		.update(S.categories)
		.set(omitBy(delta, isUndefined))
		.where(eq(S.categories.id, id));
};

export const deleteCategory = async (
	data: z.input<typeof deleteCategorySchema>,
) => {
	const { id } = deleteCategorySchema.parse(data);

	const result = await db.query.categories.findFirst({
		columns: {
			id: true,
		},
		where: (T, { eq }) => eq(T.id, id),
		with: {
			services: {
				columns: {
					id: true,
				},
			},
		},
	});

	if (!result) {
		throw new Error("ERR_DELETE_CATEGORY_CATEGORY_NOT_FOUND");
	}

	if (result.services.length !== 0) {
		throw new Error("ERR_DELETE_CATEGORY_SERVICES_NOT_EMPTY");
	}

	await db.delete(S.categories).where(eq(S.categories.id, id));
};
