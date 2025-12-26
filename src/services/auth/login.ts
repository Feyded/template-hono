import { verify } from "@node-rs/bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.js";
import { ForbiddenError, NotFoundError } from "@/utils/error.js";
import type { DbClient } from "@/db/create-db-client.js";

type LoginServiceArgs = {
  dbClient: DbClient;
  mobile_number: string;
  password: string;
};

export const loginService = async ({
  dbClient,
  mobile_number,
  password,
}: LoginServiceArgs) => {
  const user = await dbClient
    .selectFrom("users")
    .selectAll()
    .where("mobile_number", "=", mobile_number)
    .executeTakeFirst();

  if (!user) throw new NotFoundError("Account not found!");

  if (!user.is_active) throw new ForbiddenError("Account is not active!");

  const valid = await verify(password, user.password);

  if (!valid) throw new Error("Invalid credentials");

  const accessToken = await generateAccessToken({
    id: user.id,
    mobile_number: user.mobile_number,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken({
    id: user.id,
    mobile_number: user.mobile_number,
    role: user.role,
  });

  return { accessToken, refreshToken };
};
