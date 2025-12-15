import { userSchema, userSchemaOpenApi } from "@/data/users/schema.js";
import { updateUserData } from "@/data/users/update-user.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

export const updateUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({
        param: { name: "user_id", in: "path" },
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
  }),
  body: userSchema.pick({
    first_name: true,
    middle_name: true,
    last_name: true,
    email: true,
  }),
  response: userSchemaOpenApi.omit({ password: true }),
};

export const updateUserRoute = createRoute({
  middleware: [authenticationMiddleware(["ADMIN", "SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "patch",
  path: "/users/{user_id}",
  tags: ["Users"],
  summary: "Update an user",
  description: "Update an user.",
  request: {
    params: updateUserSchema.params,
    body: {
      content: {
        "application/json": {
          schema: updateUserSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: updateUserSchema.response,
        },
      },
      description: "User updated successfully",
    },
  },
});

export const updateUserRouteHandler: AppRouteHandler<
  typeof updateUserRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const param = c.req.valid("param");
  const body = c.req.valid("json");

  const user = await updateUserData({
    dbClient,
    id: param.user_id,
    payload: body,
  });
  return c.json(user, StatusCodes.OK);
};
