import { createUserData } from "@/data/users/create-user.js";
import { userSchema, userSchemaOpenApi } from "@/data/users/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

export const createUserSchema = {
  body: userSchema.pick({
    first_name: true,
    middle_name: true,
    last_name: true,
    email: true,
    password: true,
  }),
  response: userSchemaOpenApi.omit({ password: true }),
};

export const createUserRoute = createRoute({
  middleware: [authenticationMiddleware(["ADMIN", "SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "post",
  path: "/users",
  tags: ["Users"],
  summary: "Create a user",
  description: "Create a new user.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: createUserSchema.response,
        },
      },
      description: "User created successfully",
    },
  },
});

export const createUserRouteHandler: AppRouteHandler<
  typeof createUserRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const body = c.req.valid("json");

  const user = await createUserData({ dbClient, payload: body });
  return c.json(user, StatusCodes.CREATED);
};
