import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { createBusiness } from "#/lib/testing/create-business";
import { createUser } from "#/lib/testing/create-user";
import { faker as f } from "@faker-js/faker";
import { times } from "lodash-es";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import {
	createCategory,
	deleteCategory,
	moveCategory,
	updateCategory,
} from "./categories";

vi.mock("#/lib/supabase");

afterEach(() => {
	vi.resetAllMocks();
});

afterAll(() => {
	vi.restoreAllMocks();
});

describe("createCategory", () => {
	it("should create a new category", async () => {
		const { id } = await createUser();
		const { uuid: businessId } = await createBusiness(id);

		const name = f.lorem.sentence(2);
		const res = await createCategory({ businessId, name });

		expect(res).toMatchObject({ id: expect.any(Number) });

		const category = await db.query.categories.findFirst({
			where: (T, { eq }) => eq(T.id, res.id),
		});
		expect(category).toMatchObject({ name });
	});

	it("should fail when business id is not valid", async () => {
		await expect(
			createCategory({
				businessId: f.string.uuid(),
				name: f.lorem.sentence(2),
			}),
		).rejects.toThrowError("ERR_CREATE_CATEGORY_BUSINESS_NOT_FOUND");
	});
});

describe("moveCategory", () => {
	it("should shift other items forward when index is increasing", async () => {
		const { id } = await createUser();
		const business = await createBusiness(id);

		const categories = await db
			.insert(S.categories)
			.values(
				times(5, (i) => ({
					businessId: business.id,
					name: f.commerce.department(),
					order: i + 1,
				})),
			)
			.returning({ id: S.categories.id });

		await moveCategory({
			businessId: business.uuid,
			categoryId: categories[2].id,
			fromIndex: 3,
			toIndex: 5,
		});

		await expect(
			db.query.categories.findMany({
				columns: {
					id: true,
					order: true,
				},
				orderBy: (T, { asc }) => asc(T.id),
				where: (T, { eq }) => eq(T.businessId, business.id),
			}),
		).resolves.toEqual([
			{ id: categories[0].id, order: 1 },
			{ id: categories[1].id, order: 2 },
			{ id: categories[2].id, order: 5 },
			{ id: categories[3].id, order: 3 },
			{ id: categories[4].id, order: 4 },
		]);
	});

	it("should shift other items backward when index is decreasing", async () => {
		const { id } = await createUser();
		const business = await createBusiness(id);

		const categories = await db
			.insert(S.categories)
			.values(
				times(5, (i) => ({
					businessId: business.id,
					name: f.commerce.department(),
					order: i + 1,
				})),
			)
			.returning({ id: S.categories.id });

		await moveCategory({
			businessId: business.uuid,
			categoryId: categories[3].id,
			fromIndex: 4,
			toIndex: 2,
		});

		await expect(
			db.query.categories.findMany({
				columns: {
					id: true,
					order: true,
				},
				orderBy: (T, { asc }) => asc(T.id),
				where: (T, { eq }) => eq(T.businessId, business.id),
			}),
		).resolves.toEqual([
			{ id: categories[0].id, order: 1 },
			{ id: categories[1].id, order: 3 },
			{ id: categories[2].id, order: 4 },
			{ id: categories[3].id, order: 2 },
			{ id: categories[4].id, order: 5 },
		]);
	});
});

describe("updateCategory", () => {
	it("should update an existing category", async () => {
		const { id } = await createUser();
		const { id: businessId } = await createBusiness(id);

		const [{ categoryId }] = await db
			.insert(S.categories)
			.values({ businessId, name: f.lorem.sentence(2), order: 1 })
			.returning({ categoryId: S.categories.id });

		const name = f.lorem.sentence(2);
		await updateCategory({ id: categoryId, name });

		await expect(
			db.query.categories.findFirst({
				columns: {
					id: true,
					name: true,
					order: true,
				},
				where: (T, { eq }) => eq(T.businessId, businessId),
			}),
		).resolves.toEqual({ id: categoryId, name, order: 1 });
	});
});

describe("deleteCategory", () => {
	it("should remove an existing category", async () => {
		const { id } = await createUser();
		const { id: businessId } = await createBusiness(id);

		const [{ categoryId }] = await db
			.insert(S.categories)
			.values({ businessId, name: f.lorem.sentence(2), order: 1 })
			.returning({ categoryId: S.categories.id });

		await deleteCategory({ id: categoryId });

		await expect(
			db.query.categories.findMany({
				columns: {
					id: true,
					order: true,
				},
				where: (T, { eq }) => eq(T.businessId, businessId),
			}),
		).resolves.toHaveLength(0);
	});
});
