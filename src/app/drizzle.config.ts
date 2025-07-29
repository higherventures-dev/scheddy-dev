import { defineConfig } from "drizzle-kit";

const postgresUrl = new URL(process.env.POSTGRES_URL!);
postgresUrl.searchParams.delete("sslmode");

export default defineConfig({
	dialect: "postgresql",
	schema: "./lib/db/schema/",
	schemaFilter: ["public"],
	dbCredentials: {
		url: postgresUrl.toString(),
	},
	strict: true,
	verbose: true,
});
