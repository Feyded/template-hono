import { envConfig } from "@/env.js";
import { createUsers } from "./data/users.js";
import { createDbClient } from "@/db/create-db-client.js";

const dbClient = createDbClient();

async function main() {
  console.log("RUNNING SEEDER");
  console.log(envConfig.DB_URL);
  const users = await createUsers(dbClient);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await dbClient.destroy();
  });
