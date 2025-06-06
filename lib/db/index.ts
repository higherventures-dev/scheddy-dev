import * as schema from "#/lib/db/schema";
import { env } from "#/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(env.POSTGRES_URL, { schema });
