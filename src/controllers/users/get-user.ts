import { getUserData } from "@/data/users/get-user.js";
import { userSchemaOpenApi } from "@/data/users/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute, z } from "@hono/zod-openapi";

export const getUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({
        param: { name: "user_id", in: "path" },
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
  }),
  response: userSchemaOpenApi.omit({ password: true }),
};

export const getUserRoute = createRoute({
  middleware: [authenticationMiddleware(["SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "get",
  path: "/users/{user_id}",
  tags: ["Users"],
  summary: "Get user",
  description: "Retrieve a specific user.",
  request: {
    params: getUserSchema.params,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getUserSchema.response,
        },
      },
      description: "User retrieved successfully",
    },
  },
});

export const getUserRouteHandler: AppRouteHandler<typeof getUserRoute> = async (
  c
) => {
  const dbClient = c.get("dbClient");
  const param = c.req.valid("param");

  const data = await getUserData({
    dbClient,
    id: param.user_id,
  });

  return c.json(data, { status: 200 });
};
