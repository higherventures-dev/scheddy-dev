import { relations } from "drizzle-orm";
import { bookings } from "./bookings";
import { businesses } from "./businesses";
import { schedule } from "./schedule";
import { services } from "./services";
import { servicesToCategories } from "./services-to-categories";

export const servicesRelations = relations(services, ({ one, many }) => ({
	business: one(businesses, {
		fields: [services.businessId],
		references: [businesses.id],
	}),
	bookings: many(bookings),
	category: many(servicesToCategories),
	schedule: many(schedule),
}));
