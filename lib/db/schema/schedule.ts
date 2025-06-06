import { integer, pgTable, smallint } from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { identity } from "./helpers";
import { services } from "./services";

export const schedule = pgTable("schedule", {
	...identity,
	serviceId: integer("service_id")
		.notNull()
		.references(() => services.id),
	employeeId: integer("employee_id")
		.notNull()
		.references(() => employees.id),
	weekday: smallint("weekday").notNull(),
	minutesFromStart: smallint("minutes_from_start").notNull(),
});
