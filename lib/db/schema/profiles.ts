import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { identity } from "./helpers";
import { users } from "./users";

export const profiles = pgTable("profiles", {
	...identity,
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	givenName: varchar("given_name"),
	familyName: varchar("family_name"),
	email: varchar("email"),
	phone: text("phone"),
});
