"use server";

import type { SignUpHandler } from "#/app/auth/signup/form";
import { db } from "#/lib/db";
import * as S from "#/lib/db/schema";
import { createClient } from "#/lib/supabase";

export const signUp: SignUpHandler = async ({ email, password, ...data }) => {
	const supabase = await createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.signUp({
		email,
		password,
		options: { data },
	});

	if (error) {
		throw error;
	}

	if (!user) {
		throw new Error("User not found");
	}

	await db.insert(S.profiles).values({
		userId: user.id,
		email,
		givenName: data.firstName,
		familyName: data.lastName,
	});
};
