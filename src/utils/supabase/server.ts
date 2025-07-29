"use server";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function createClient() {
	const cookieStore = cookies();

	return createServerComponentClient({
		cookies: () => cookieStore,
	});
}