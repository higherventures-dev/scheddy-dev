import { db } from "#/lib/db";
import { getUser, uploadImage } from "#/lib/supabase";
import { createUser } from "#/lib/testing/create-user";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { createBusiness } from "./create-business";

vi.mock("#/lib/supabase");

afterEach(() => {
	vi.resetAllMocks();
});

afterAll(() => {
	vi.restoreAllMocks();
});

describe("createBusiness", () => {
	it("should create a new business", async () => {
		const { userId } = await createUser();

		vi.mocked(getUser).mockResolvedValue({
			user: {
				id: userId,

				app_metadata: {},
				aud: "",
				created_at: "",
				user_metadata: {},
			},
			error: null,
		});

		const logoUrl = `https://scheddy.storage.com/logos/${userId}.png`;
		vi.mocked(uploadImage).mockResolvedValue(logoUrl);

		const fd = new FormData();
		fd.append("logo", new File([], "test.png", { type: "image/png" }));
		fd.append("displayName", "Test Business");
		fd.append("website", "https://example.com");

		const res = await createBusiness(fd);

		expect(res).toMatchObject({ uuid: expect.any(String) });

		const business = await db.query.businesses.findFirst({
			where: (T, { eq }) => eq(T.uuid, res.uuid),
		});
		expect(business).toMatchObject({
			logo: logoUrl,
			displayName: "Test Business",
			website: "https://example.com",
		});
	});
});
