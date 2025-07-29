import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email().trim(),
	password: z.string().min(8).trim(),
});
