"use server";

import { createClient } from "#/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { signInSchema } from "./sign-in.schema";

export const signIn = async (data: z.input<typeof signInSchema>) => {
	const credentials = signInSchema.parse(data);

	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword(credentials);

	if (error) {
		throw error;
	}

	revalidatePath("/", "layout");
	redirect("/");
};
