import type { DbClient } from "@/db/create-db-client.js";
import { UserRoleType } from "@/db/types.js";

export async function createUsers(dbClient: DbClient) {
  const users = [
    {
      first_name: "Karla",
      middle_name: null,
      last_name: "Go",
      role: UserRoleType.SUPER_ADMIN,
      mobile_number: "09429318299",
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
    {
      first_name: "John",
      middle_name: null,
      last_name: "Doe",
      role: UserRoleType.ADMIN,
      mobile_number: "0942931019",
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
  ];

  for (const user of users) {
    const exist = await dbClient
      .selectFrom("users")
      .where("mobile_number", "=", user.mobile_number)
      .executeTakeFirst();

    if (!exist) {
      await dbClient.insertInto("users").values(user).execute();
      console.log(`Seeded user: ${user.first_name} ${user.last_name}`);
    }
  }

  return users;
}
