import { relations } from "drizzle-orm";
import { bookings } from "./bookings";
import { businesses } from "./businesses";
import { customers } from "./customers";
import { profiles } from "./profiles";

export const customersRelations = relations(customers, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [customers.profileId],
		references: [profiles.id],
	}),
	business: one(businesses, {
		fields: [customers.businessId],
		references: [businesses.id],
	}),
	bookings: many(bookings),
}));
