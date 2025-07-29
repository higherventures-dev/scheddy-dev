import { integer, pgTable, smallint, unique } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { identity } from "./helpers";
import { services } from "./services";

export const servicesToCategories = pgTable(
	"services_to_categories",
	{
		...identity,
		serviceId: integer("service_id")
			.notNull()
			.references(() => services.id),
		categoryId: integer("category_id")
			.notNull()
			.references(() => categories.id),
		order: smallint("order").notNull(),
	},
	(t) => [unique().on(t.serviceId, t.categoryId)],
);
