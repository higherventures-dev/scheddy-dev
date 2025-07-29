import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { getUser } from "#/lib/supabase";
import { createBusiness } from "#/lib/testing/create-business";
import { createUser } from "#/lib/testing/create-user";
import { faker as f } from "@faker-js/faker";
import { pick } from "lodash-es";
import { describe, expect, it, vi } from "vitest";
import { createBooking } from "./create-booking";

vi.mock("#/lib/supabase");

const setupTest = async () => {
	const { id } = await createUser();
	const business = await createBusiness(id);

	const [employee] = await db
		.insert(S.employees)
		.values({
			businessId: business.id,
			profileId: id,
			role: f.person.jobType(),
		})
		.returning({ id: S.employees.id });

	const [category] = await db
		.insert(S.categories)
		.values({ businessId: business.id, name: "Haircut", order: 1 })
		.returning({ id: S.categories.id });

	const [service] = await db
		.insert(S.services)
		.values({
			businessId: business.id,
			name: "Mid Fade",
			price: "45.00",
			duration: 45,
		})
		.returning({ id: S.services.id });

	await db.insert(S.schedule).values({
		employeeId: employee.id,
		serviceId: service.id,
		weekday: 4,
		minutesFromStart: 10 * 60,
	});

	await db
		.insert(S.servicesToCategories)
		.values({ categoryId: category.id, serviceId: service.id, order: 0 });

	const customer = await createUser();

	vi.mocked(getUser).mockResolvedValue({
		user: {
			id: customer.userId,

			app_metadata: {},
			aud: "",
			created_at: "",
			user_metadata: {},
		},
		error: null,
	});

	return { business, employee, service, customer };
};

describe("createBooking", () => {
	it("should create booking on success", async () => {
		const { business, service, customer } = await setupTest();

		const res = await createBooking({
			businessId: business.uuid,
			serviceId: service.id,
			time: "2024-11-28T18:00:00Z", // 10:00:00 @ America/Los_Angeles (UTC-8)
			...pick(customer, ["givenName", "familyName", "email", "phone"]),
			comments: f.lorem.paragraph(1),
		});

		expect(res).toMatchObject({ id: expect.any(Number) });

		const booking = await db.query.bookings.findFirst({
			where: (T, { eq }) => eq(T.id, res.id),
		});

		expect(booking!.serviceId).toBe(service.id);
		expect(Number(booking!.price)).toBe(45);
		expect(booking!.startTime.toISOString()).toBe("2024-11-28T18:00:00.000Z");
	});

	it("should fail when business id is not valid", async () => {
		const { service, customer } = await setupTest();

		await expect(
			createBooking({
				businessId: f.string.uuid(),
				serviceId: service.id,
				time: "2024-11-28T18:00:00Z",
				...pick(customer, ["givenName", "familyName", "email", "phone"]),
				comments: f.lorem.paragraph(1),
			}),
		).rejects.toThrowError("ERR_CREATE_BOOKING_BUSINESS_NOT_FOUND");
	});

	it.skip("should fail when employee id is not valid", async () => {
		const { business, service, customer } = await setupTest();

		await expect(
			createBooking({
				businessId: business.uuid,
				serviceId: service.id,
				time: "2024-11-28T18:00:00Z",
				...pick(customer, ["givenName", "familyName", "email", "phone"]),
				comments: f.lorem.paragraph(1),
			}),
		).rejects.toThrowError("ERR_CREATE_BOOKING_EMPLOYEE_NOT_FOUND");
	});

	it("should fail when service id is not valid", async () => {
		const { business, customer } = await setupTest();

		await expect(
			createBooking({
				businessId: business.uuid,
				serviceId: -1,
				time: "2024-11-28T18:00:00Z",
				...pick(customer, ["givenName", "familyName", "email", "phone"]),
				comments: f.lorem.paragraph(1),
			}),
		).rejects.toThrowError("ERR_CREATE_BOOKING_SERVICE_NOT_FOUND");
	});
});
