import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { identity } from "./helpers";

export const systemSettings = pgTable("system_settings", {
	...identity,

	key: varchar("key").notNull(),
	value: text("value").notNull(),

	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});
