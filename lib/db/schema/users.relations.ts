import { relations } from "drizzle-orm";
import { profiles } from "./profiles";
import { users } from "./users";

export const usersRelations = relations(users, ({ one }) => ({
	profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
}));
