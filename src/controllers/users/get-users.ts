import { getUsersData } from "@/data/users/get-users.js";
import { userSchemaFields, userSchemaOpenApi } from "@/data/users/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { listQuerySchema, paginationSchema } from "@/utils/zod-schema.js";
import { createRoute, z } from "@hono/zod-openapi";

export const getUsersSchema = {
  query: listQuerySchema.extend({
    sort_by: userSchemaFields.optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(userSchemaOpenApi.omit({ password: true })),
    total_records: z.number(),
    total_pages: z.number(),
    current_page: z.number(),
    next_page: z.number().nullable(),
    previous_page: z.number().nullable(),
  }),
};

export const getUsersRoute = createRoute({
  middleware: [authenticationMiddleware(["ADMIN", "SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "get",
  path: "/users",
  tags: ["Users"],
  summary: "List all users",
  description: "Retrieve a list of all users.",
  request: {
    query: getUsersSchema.query,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getUsersSchema.response,
        },
      },
      description: "Users retrieved successfully",
    },
  },
});

export const getUsersRouteHandler: AppRouteHandler<
  typeof getUsersRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const query = c.req.valid("query");

  const data = await getUsersData({
    dbClient,
    limit: query?.limit,
    page: query?.page,
  });

  return c.json(data, { status: 200 });
};
