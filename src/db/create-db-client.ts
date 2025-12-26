import { envConfig, isTest } from "@/env.js";
import { Kysely, PostgresDialect } from "kysely";
import { ForbiddenError } from "@/utils/error.js";
import pg from "pg";
import type { KyselySchema } from "./schema.js";

export function createDbClient() {
  if (isTest())
    throw new ForbiddenError(
      "createDbClient cannot be used in test environment use createTestDbClient instead."
    );

  const dbClient = new Kysely<KyselySchema>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString: envConfig.DB_URL,
        max: 50, // Set maximum <number> of client(s) in the pool
        connectionTimeoutMillis: 20000, //20 seconds return an error after <number> second(s) if connection could not be established
        idleTimeoutMillis: 30000, // close idle clients after <number> second(s)
      }),
    }),
  });

  return dbClient;
}

/**
 * This is a helper function to create a database client for testing purposes only.
 */
export function createTestDbClient() {
  const dbClient = new Kysely<KyselySchema>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString: envConfig.TEST_DB_URL,
        max: 50, // Set maximum <number> of client(s) in the pool
        connectionTimeoutMillis: 20000, //20 seconds return an error after <number> second(s) if connection could not be established
        idleTimeoutMillis: 30000, // close idle clients after <number> second(s)
      }),
    }),
  });

  return dbClient;
}

export type DbClient =
  | ReturnType<typeof createDbClient>
  | ReturnType<typeof createTestDbClient>;
