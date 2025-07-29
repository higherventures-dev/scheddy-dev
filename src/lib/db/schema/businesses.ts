import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { identity, timestamps } from "./helpers";
import { profiles } from "./profiles";

export const businesses = pgTable("businesses", {
	...identity,
	uuid: uuid("uuid").notNull().unique().defaultRandom(),
	ownerId: integer("owner_id")
		.notNull()
		.references(() => profiles.id),
	displayName: varchar("display_name").notNull(),
	slug: varchar("slug").unique(),
	website: varchar("website"),
	logo: varchar("logo"),
	businessType: varchar("business_type"),
	timezone: varchar("timezone").notNull(),

	address: varchar("address"),
	about: text("about"),
	email: varchar("email"),
	phone: varchar("phone"),
	cancellationPolicy: text("cancellation_policy"),

	...timestamps,
});
