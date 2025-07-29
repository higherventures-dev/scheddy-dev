"use server";

import { createClient } from "#/lib/supabase";

export const signInWithOtp = async ({ email }: { email: string }) => {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOtp({ email });
	if (error) {
		throw error;
	}

	return data;
};
