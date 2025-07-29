import { z } from "zod";

const schema = z.object({
	NODE_ENV: z.string(),

	DATABASE_CA: z.string().optional(),
	POSTGRES_URL: z
		.string()
		.url()
		.transform((arg) => {
			const url = new URL(arg);
			// eslint-disable-next-line drizzle/enforce-delete-with-where
			url.searchParams.delete("sslmode");
			return url.toString();
		}),

	GOOGLE_API_KEY: z.string(),

	NEXT_PUBLIC_SUPABASE_URL: z.string(),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

export const env = schema.parse({
	NODE_ENV: process.env.NODE_ENV,
	POSTGRES_URL: process.env.POSTGRES_URL,
	GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
	NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
