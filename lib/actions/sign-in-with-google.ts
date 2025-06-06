"use server";

import { createClient } from "#/lib/supabase";

export const signInWithGoogle = async (redirectTo?: string) => {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo,
			queryParams: {
				access_type: "offline",
				prompt: "consent",
			},
		},
	});

	if (error) {
		throw error;
	}

	return data.url;
};
