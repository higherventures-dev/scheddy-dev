import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { identity, timestamps } from "./helpers";
import { profiles } from "./profiles";

export const customers = pgTable(
	"customers",
	{
		...identity,
		uuid: uuid("uuid").notNull().unique().defaultRandom(),
		profileId: integer("profile_id")
			.notNull()
			.references(() => profiles.id),
		businessId: integer("business_id")
			.notNull()
			.references(() => businesses.id),
		...timestamps,
	},
	(t) => [unique().on(t.profileId, t.businessId)],
);
