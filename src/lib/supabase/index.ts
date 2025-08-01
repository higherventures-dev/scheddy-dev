"use server";

import { env } from "@/lib/env";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			auth: {
				flowType: "pkce",
			},
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}

export async function getUser() {
	const supabase = await createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	return { user, error };
}

export async function uploadImage(path: string, fileBody: File) {
	const supabase = await createClient();

	const { error } = await supabase.storage
		.from("images")
		.upload(path, fileBody, { upsert: true });

	if (error) {
		throw error;
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from("images").getPublicUrl(path);

	return publicUrl;
}
