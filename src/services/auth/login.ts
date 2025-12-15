import { verify } from "@node-rs/bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.js";
import { ForbiddenError, NotFoundError } from "@/utils/error.js";
import type { DbClient } from "@/db/create-db-client.js";

type LoginServiceArgs = {
  dbClient: DbClient;
  email: string;
  password: string;
};

export const loginService = async ({
  dbClient,
  email,
  password,
}: LoginServiceArgs) => {
  const user = await dbClient
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user) throw new NotFoundError("User not found!");

  if (!user.is_active) throw new ForbiddenError("User not active!");

  const valid = await verify(password, user.password);

  if (!valid) throw new Error("Invalid credentials");

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken, refreshToken };
};
