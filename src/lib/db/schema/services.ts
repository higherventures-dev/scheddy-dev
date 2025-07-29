import {
	decimal,
	integer,
	pgTable,
	smallint,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { identity } from "./helpers";

export const services = pgTable("services", {
	...identity,
	uuid: uuid("uuid").notNull().unique().defaultRandom(),
	businessId: integer("business_id")
		.notNull()
		.references(() => businesses.id),
	name: varchar("name").notNull(),
	description: varchar("description"),
	price: decimal("price").notNull(),
	upfrontPrice: decimal("upfront_price"),
	duration: smallint("duration").notNull(),
	prepareTime: smallint("prepare_time"),
	cleanupTime: smallint("cleanup_time"),
});
