import { integer, pgTable, smallint, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { identity } from "./helpers";

export const categories = pgTable("categories", {
	...identity,
	businessId: integer("business_id")
		.notNull()
		.references(() => businesses.id),
	name: varchar("name").notNull(),
	order: smallint("order").notNull(),
});
