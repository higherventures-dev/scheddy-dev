import {
	decimal,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { employees } from "./employees";
import { identity, timestamps } from "./helpers";
import { profiles } from "./profiles";
import { services } from "./services";

export const bookings = pgTable("bookings", {
	...identity,

	customerId: integer("customer_id").references(() => customers.id),
	profileId: integer("profile_id").references(() => profiles.id),
	employeeId: integer("employee_id").references(() => employees.id),
	serviceId: integer("service_id").references(() => services.id),

	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	price: decimal("price").notNull(),
	comments: text(),

	confirmedAt: timestamp("confirmed_at"),
	cancelledAt: timestamp("cancelled_at"),

	...timestamps,
});
