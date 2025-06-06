import { z } from "zod";

export const createCategorySchema = z.object({
	businessId: z.string().uuid(),
	name: z.string(),
});

export const moveCategorySchema = z.object({
	businessId: z.string().uuid(),
	categoryId: z.number(),
	fromIndex: z.number(),
	toIndex: z.number(),
});

export const updateCategorySchema = z.object({
	id: z.number(),
	name: z.string().optional(),
});

export const deleteCategorySchema = z.object({
	id: z.number(),
});
