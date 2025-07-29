import { relations } from "drizzle-orm";
import { bookings } from "./bookings";
import { customers } from "./customers";
import { employees } from "./employees";
import { profiles } from "./profiles";
import { services } from "./services";

export const bookingsRelations = relations(bookings, ({ one }) => ({
	customer: one(customers, {
		fields: [bookings.customerId],
		references: [customers.id],
		relationName: "customer",
	}),
	profile: one(profiles, {
		fields: [bookings.profileId],
		references: [profiles.id],
		relationName: "profile",
	}),
	employee: one(employees, {
		fields: [bookings.employeeId],
		references: [employees.id],
		relationName: "employee",
	}),
	service: one(services, {
		fields: [bookings.customerId],
		references: [services.id],
		relationName: "service",
	}),
}));
