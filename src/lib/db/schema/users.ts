import { pgSchema, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
	id: uuid("id").primaryKey(),
	email: varchar("email"),
	emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
	phone: text("phone"),
	phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
