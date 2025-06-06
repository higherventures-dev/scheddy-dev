import { relations } from "drizzle-orm";
import { schedule } from "./schedule";
import { employees } from "./employees";
import { services } from "./services";

export const scheduleRelations = relations(schedule, ({ one }) => ({
	service: one(services, {
		fields: [schedule.serviceId],
		references: [services.id],
	}),
	employee: one(employees, {
		fields: [schedule.employeeId],
		references: [employees.id],
	}),
}));
