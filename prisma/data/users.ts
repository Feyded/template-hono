import type { DbClient } from "@/db/create-db-client.js";
import { UserRoleType } from "@/db/types.js";

export async function createUsers(dbClient: DbClient) {
  const users = [
    {
      first_name: "James",
      middle_name: "Paul",
      last_name: "Ilagan",
      email: "james@example.com",
      role: UserRoleType.SUPER_ADMIN,
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
    {
      first_name: "John",
      middle_name: null,
      last_name: "Doe",
      email: "john@example.com",
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
    {
      first_name: "Mark",
      middle_name: "Kanlo",
      last_name: "Kanlas",
      email: "mark@example.com",
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
  ];

  for (const user of users) {
    const exist = await dbClient
      .selectFrom("users")
      .where("email", "=", user.email)
      .executeTakeFirst();

    if (!exist) {
      await dbClient.insertInto("users").values(user).execute();
      console.log(`Seeded user: ${user.first_name} ${user.last_name}`);
    }
  }

  return users;
}
