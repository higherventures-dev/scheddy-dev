import type { FormFields } from "#/lib/components/forms/intake-form/fields-to-schema";
import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { identity, timestamps } from "./helpers";

export const forms = pgTable("forms", {
	...identity,

	businessId: integer("business_id").references(() => businesses.id),

	title: varchar("title").notNull(),
	subtitle: varchar("subtitle").notNull(),
	fields: json("fields").$type<FormFields>().notNull(),

	...timestamps,
});
