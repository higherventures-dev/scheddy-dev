import { dayjs } from "#/lib/dayjs";
import { z } from "zod";

export const eventSchema = z.object({
	// kind: z.literal("calendar#event"),
	// etag: z.string(),
	id: z.number(),
	employeeId: z.number(),
	status: z
		.union([
			z.literal("confirmed"),
			z.literal("tentative"),
			z.literal("cancelled"),
		])
		.optional(),
	// htmlLink: z.string(),
	// created: z
	// 	.string()
	// 	.datetime()
	// 	.transform((datetime) => dayjs(datetime)),
	// updated: z
	// 	.string()
	// 	.datetime()
	// 	.transform((datetime) => dayjs(datetime)),
	summary: z.string(),
	description: z.string().optional(),
	// location: z.string().optional(),
	colorId: z.string().optional(),
	// creator: z.object({
	// 	id: z.string().optional(),
	// 	email: z.string().email().optional(),
	// 	displayName: z.string().optional(),
	// 	self: z.boolean(),
	// }),
	// organizer: z.object({
	// 	id: z.string().optional(),
	// 	email: z.string().email().optional(),
	// 	displayName: z.string().optional(),
	// 	self: z.boolean(),
	// }),
	start: z.object({
		date: z
			.string()
			.date()
			.transform((date) => dayjs(date, "YYYY-MM-DD")),
		dateTime: z
			.string()
			.datetime()
			.transform((datetime) => dayjs(datetime)),
		// timeZone: z.string(),
	}),
	end: z.object({
		date: z
			.string()
			.date()
			.transform((date) => dayjs(date, "YYYY-MM-DD")),
		dateTime: z
			.string()
			.datetime()
			.transform((datetime) => dayjs(datetime)),
		// timeZone: z.string(),
	}),
	// endTimeUnspecified: z.boolean(),
	// recurrence: z.array(z.string()),
});

export type EventInput = z.input<typeof eventSchema>;
export type Event = z.infer<typeof eventSchema>;
