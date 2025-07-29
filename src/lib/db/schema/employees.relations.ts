import { relations } from "drizzle-orm";
import { bookings } from "./bookings";
import { businesses } from "./businesses";
import { employees } from "./employees";
import { profiles } from "./profiles";

export const employeesRelations = relations(employees, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [employees.profileId],
		references: [profiles.id],
	}),
	business: one(businesses, {
		fields: [employees.businessId],
		references: [businesses.id],
	}),
	bookings: many(bookings),
}));
