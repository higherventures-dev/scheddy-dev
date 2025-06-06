import { relations } from "drizzle-orm";
import { businesses } from "./businesses";
import { categories } from "./categories";
import { servicesToCategories } from "./services-to-categories";

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	business: one(businesses, {
		fields: [categories.businessId],
		references: [businesses.id],
	}),
	services: many(servicesToCategories),
}));
