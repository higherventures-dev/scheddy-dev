import { z } from "zod";

export const createServiceSchema = z.object({
	businessId: z.string().uuid(),
	categoryIds: z.array(z.number()),
	name: z.string(),
	description: z.string().nullable(),
	price: z.string(),
	duration: z.number().positive(),
});

export const moveServiceSchema = z.object({
	businessId: z.string().uuid(),
	categoryId: z.number(),
	serviceId: z.number(),
	fromIndex: z.number(),
	toIndex: z.number(),
});

export const deleteServiceSchema = z.object({
	id: z.number(),
});
