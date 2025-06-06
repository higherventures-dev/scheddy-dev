import { integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { identity, timestamps } from "./helpers";
import { profiles } from "./profiles";

export const employees = pgTable(
	"employees",
	{
		...identity,
		profileId: integer("profile_id")
			.notNull()
			.references(() => profiles.id),
		businessId: integer("business_id")
			.notNull()
			.references(() => businesses.id),
		role: varchar("role").notNull(),
		avatar: varchar("avatar"),
		...timestamps,
	},
	(t) => [unique().on(t.profileId, t.businessId)],
);
