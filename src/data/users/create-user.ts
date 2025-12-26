import type { DbClient } from "@/db/create-db-client.js";
import { ConflictError } from "@/utils/error.js";
import { hash } from "@node-rs/bcrypt";

export type CreateUserDataArgs = {
  dbClient: DbClient;
  payload: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    mobile_number: string;
    password: string;
  };
};
export async function createUserData({
  dbClient,
  payload,
}: CreateUserDataArgs) {
  let baseQuery = dbClient.selectFrom("users");

  const mobileExist = await baseQuery
    .where("mobile_number", "=", payload.mobile_number)
    .executeTakeFirst();

  if (mobileExist) {
    throw new ConflictError("Mobile number already exist.");
  }

  const hashPassword = await hash(payload.password, 10);

  const createdUser = await dbClient
    .insertInto("users")
    .values({ ...payload, password: hashPassword })
    .returningAll()
    .executeTakeFirstOrThrow();

  const { password, ...safeUser } = createdUser;

  return safeUser;
}
