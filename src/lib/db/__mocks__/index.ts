import { createRequire } from "node:module";
import { beforeAll } from "vitest";
import { db } from "..";
import * as schema from "../schema";

beforeAll(async () => {
	const require = createRequire(import.meta.url);
	const { pushSchema } =
		require("drizzle-kit/api") as typeof import("drizzle-kit/api");

	// @ts-expect-error buggy types
	const patch = await pushSchema(schema, db, ["auth", "public"]);
	await patch.apply();
});

export * from "..";
