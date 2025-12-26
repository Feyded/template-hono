import { userSchema, userSchemaOpenApi } from "@/data/users/schema.js";
import { updateUserPasswordData } from "@/data/users/update-user-password.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

export const updateUserPasswordSchema = {
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
    password: true,
  }),
  response: userSchemaOpenApi.omit({ password: true }),
};

export const updateUserPasswordRoute = createRoute({
  middleware: [authenticationMiddleware(["SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "patch",
  path: "/users/{user_id}/password",
  tags: ["Users"],
  summary: "Update user password",
  description: "Update user password.",
  request: {
    params: updateUserPasswordSchema.params,
    body: {
      content: {
        "application/json": {
          schema: updateUserPasswordSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: updateUserPasswordSchema.response,
        },
      },
      description: "User updated successfully",
    },
  },
});

export const updateUserPasswordRouteHandler: AppRouteHandler<
  typeof updateUserPasswordRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const param = c.req.valid("param");
  const body = c.req.valid("json");

  const user = await updateUserPasswordData({
    dbClient,
    id: param.user_id,
    payload: body,
  });
  return c.json(user, StatusCodes.OK);
};
