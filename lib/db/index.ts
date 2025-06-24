// import * as schema from "@/lib/db/schema";
// import { env } from "@/lib/env";
// import { drizzle } from "drizzle-orm/node-postgres";

// export const db = drizzle(env.POSTGRES_URL, { schema });

// lib/db/index.ts

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from '@/lib/db/schema';

export const db = drizzle(sql, { schema });