import { dayjs } from "#/lib/dayjs";
import { z } from "zod";

export const schema = z.object({
	businessId: z.string(),
	serviceId: z.number(),
	time: z
		.string()
		.datetime()
		.transform((arg) => dayjs(arg)),
	givenName: z.string().min(1),
	familyName: z.string(),
	phone: z.string(),
	email: z.string().email(),
	comments: z.string(),
});
