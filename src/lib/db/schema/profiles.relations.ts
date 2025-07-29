import { relations } from "drizzle-orm";
import { bookings } from "./bookings";
import { businesses } from "./businesses";
import { employees } from "./employees";
import { profiles } from "./profiles";
import { users } from "./users";

export const profilesRelations = relations(profiles, ({ one, many }) => ({
	user: one(users, { fields: [profiles.userId], references: [users.id] }),
	bookings: many(bookings),
	businesses: many(businesses),
	employment: many(employees),
}));
