import { relations } from "drizzle-orm";
import { businesses } from "./businesses";
import { forms } from "./forms";

export const formsRelations = relations(forms, ({ one }) => ({
	business: one(businesses, {
		fields: [forms.businessId],
		references: [businesses.id],
		relationName: "business",
	}),
}));
