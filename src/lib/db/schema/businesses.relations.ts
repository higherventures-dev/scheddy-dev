import { relations } from "drizzle-orm";
import { businesses } from "./businesses";
import { categories } from "./categories";
import { customers } from "./customers";
import { employees } from "./employees";
import { forms } from "./forms";
import { profiles } from "./profiles";
import { services } from "./services";

export const businessesRelations = relations(businesses, ({ one, many }) => ({
	owner: one(profiles, {
		fields: [businesses.ownerId],
		references: [profiles.id],
	}),
	categories: many(categories),
	customers: many(customers),
	employees: many(employees),
	forms: many(forms),
	services: many(services),
}));
