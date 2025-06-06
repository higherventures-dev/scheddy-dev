import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { createBusiness } from "#/lib/testing/create-business";
import { createUser } from "#/lib/testing/create-user";
import { faker as f } from "@faker-js/faker";
import { times } from "lodash-es";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { createService, deleteService, moveService } from "./services";

vi.mock("#/lib/supabase");

afterEach(() => {
	vi.resetAllMocks();
});

afterAll(() => {
	vi.restoreAllMocks();
});

describe("createService", () => {
	it("should create a new service", async () => {
		const { id } = await createUser();
		const business = await createBusiness(id);

		const [{ categoryId }] = await db
			.insert(S.categories)
			.values({
				businessId: business.id,
				name: f.lorem.sentence(2),
				order: 1,
			})
			.returning({ categoryId: S.categories.id });

		const name = f.lorem.sentence(2);
		const description = f.lorem.sentence();
		const duration = f.number.int({ min: 10, max: 120 });
		const price = f.number.float({ min: 10, max: 100 });

		const res = await createService({
			businessId: business.uuid,
			categoryIds: [categoryId],
			name,
			description,
			duration,
			price: price.toFixed(4),
		});

		expect(res).toMatchObject({ id: expect.any(Number) });

		const service = await db.query.services.findFirst({
			where: (T, { eq }) => eq(T.id, res.id),
			with: {
				category: {},
			},
		});
		expect(service).toEqual({
			id: res.id,
			businessId: business.id,
			uuid: expect.any(String),
			name,
			description,
			duration,
			prepareTime: null,
			cleanupTime: null,
			price: price.toFixed(4),
			upfrontPrice: null,
			category: [
				{
					id: expect.any(Number),
					categoryId,
					order: 1,
					serviceId: res.id,
				},
			],
		});
	});

	it("should fail when business id is not valid", async () => {
		await expect(
			createService({
				businessId: f.string.uuid(),
				categoryIds: [f.number.int({ min: 1, max: 100 })],
				name: f.lorem.sentence(2),
				description: f.lorem.sentence(),
				duration: f.number.int({ min: 10, max: 120 }),
				price: f.number.float({ min: 10, max: 100 }).toFixed(4),
			}),
		).rejects.toThrowError("ERR_CREATE_SERVICE_BUSINESS_NOT_FOUND");
	});

	it("should fail when category id is not valid", async () => {
		const { id } = await createUser();
		const { uuid } = await createBusiness(id);

		await expect(
			createService({
				businessId: uuid,
				categoryIds: [f.number.int({ min: 1, max: 100 })],
				name: f.lorem.sentence(2),
				description: f.lorem.sentence(),
				duration: f.number.int({ min: 10, max: 120 }),
				price: f.number.float({ min: 10, max: 100 }).toFixed(4),
			}),
		).rejects.toThrowError("ERR_CREATE_SERVICE_CATEGORY_NOT_FOUND");
	});
});

describe("moveService", () => {
	it("should shift other items forward when index is increasing", async () => {
		const { id } = await createUser();
		const business = await createBusiness(id);

		const [{ id: categoryId }] = await db
			.insert(S.categories)
			.values({
				businessId: business.id,
				name: f.commerce.department(),
				order: 1,
			})
			.returning({ id: S.categories.id });

		const services = await db
			.insert(S.services)
			.values(
				times(5, () => ({
					businessId: business.id,
					name: f.commerce.product(),
					duration: f.number.int({ min: 10, max: 120 }),
					price: f.number.float({ min: 10, max: 100 }).toFixed(4),
				})),
			)
			.returning({ id: S.services.id });

		await db.insert(S.servicesToCategories).values(
			services.map(({ id: serviceId }, i) => ({
				categoryId,
				serviceId,
				order: i + 1,
			})),
		);

		await moveService({
			businessId: business.uuid,
			categoryId,
			serviceId: services[2].id,
			fromIndex: 3,
			toIndex: 5,
		});

		const servicesToCategories = await db.query.servicesToCategories.findMany({
			columns: {
				serviceId: true,
				order: true,
			},
			orderBy: (T, { asc }) => asc(T.serviceId),
			where: (T, { eq }) => eq(T.categoryId, categoryId),
		});

		expect(servicesToCategories).toEqual([
			{ serviceId: services[0].id, order: 1 },
			{ serviceId: services[1].id, order: 2 },
			{ serviceId: services[2].id, order: 5 },
			{ serviceId: services[3].id, order: 3 },
			{ serviceId: services[4].id, order: 4 },
		]);
	});

	it("should shift other items backward when index is decreasing", async () => {
		const { id } = await createUser();
		const business = await createBusiness(id);

		const [{ id: categoryId }] = await db
			.insert(S.categories)
			.values({
				businessId: business.id,
				name: f.commerce.department(),
				order: 1,
			})
			.returning({ id: S.categories.id });

		const services = await db
			.insert(S.services)
			.values(
				times(5, () => ({
					businessId: business.id,
					name: f.commerce.product(),
					duration: f.number.int({ min: 10, max: 120 }),
					price: f.number.float({ min: 10, max: 100 }).toFixed(4),
				})),
			)
			.returning({ id: S.services.id });

		await db.insert(S.servicesToCategories).values(
			services.map(({ id: serviceId }, i) => ({
				businessId: business.id,
				categoryId,
				serviceId,
				order: i + 1,
			})),
		);

		await moveService({
			businessId: business.uuid,
			categoryId,
			serviceId: services[3].id,
			fromIndex: 4,
			toIndex: 2,
		});

		const servicesToCategories = await db.query.servicesToCategories.findMany({
			columns: {
				serviceId: true,
				order: true,
			},
			orderBy: (T, { asc }) => asc(T.serviceId),
			where: (T, { eq }) => eq(T.categoryId, categoryId),
		});

		expect(servicesToCategories).toEqual([
			{ serviceId: services[0].id, order: 1 },
			{ serviceId: services[1].id, order: 3 },
			{ serviceId: services[2].id, order: 4 },
			{ serviceId: services[3].id, order: 2 },
			{ serviceId: services[4].id, order: 5 },
		]);
	});
});

describe("deleteService", () => {
	it("should remove an existing service", async () => {
		const { id } = await createUser();
		const business = await createBusiness(id);

		const [{ serviceId }] = await db
			.insert(S.services)
			.values({
				businessId: business.id,
				name: f.commerce.product(),
				duration: f.number.int({ min: 10, max: 120 }),
				price: f.number.float({ min: 10, max: 100 }).toFixed(4),
			})
			.returning({ serviceId: S.categories.id });

		await deleteService({ id: serviceId });

		await expect(
			db.query.categories.findMany({
				columns: {
					id: true,
					order: true,
				},
				where: (T, { eq }) => eq(T.businessId, business.id),
			}),
		).resolves.toHaveLength(0);
	});
});
