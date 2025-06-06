import { integer, timestamp } from "drizzle-orm/pg-core";

export const identity = {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
};

export const timestamps = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deleted_at"),
};
