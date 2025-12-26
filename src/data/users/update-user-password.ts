import { NotFoundError } from "@/utils/error.js";
import type { DbClient } from "@/db/create-db-client.js";
import { hash } from "@node-rs/bcrypt";

type UpdateUserPasswordDataArgs = {
  dbClient: DbClient;
  id: string;
  payload: { password: string };
};

export async function updateUserPasswordData({
  dbClient,
  id,
  payload,
}: UpdateUserPasswordDataArgs) {
  const user = await dbClient
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const hashPassword = await hash(payload.password, 10);

  return await dbClient
    .updateTable("users")
    .set({ password: hashPassword })
    .where("id", "=", id)
    .returning([
      "id",
      "first_name",
      "middle_name",
      "last_name",
      "role",
      "is_active",
      "mobile_number",
      "created_at",
      "updated_at",
    ])
    .executeTakeFirst();
}
