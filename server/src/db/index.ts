import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:1234@localhost:5432/starter_db";

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
