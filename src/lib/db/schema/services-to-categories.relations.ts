import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { services } from "./services";
import { servicesToCategories } from "./services-to-categories";

export const servicesToCategoriesRelations = relations(
	servicesToCategories,
	({ one }) => ({
		service: one(services, {
			fields: [servicesToCategories.serviceId],
			references: [services.id],
		}),
		category: one(categories, {
			fields: [servicesToCategories.categoryId],
			references: [categories.id],
		}),
	}),
);
