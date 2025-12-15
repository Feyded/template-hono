import {
  getOrdersData,
  type GetOrdersDataArgs,
} from "@/data/orders/get-orders.js";
import { orderSchemaFields, orderSchemaOpenApi } from "@/data/orders/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { listQuerySchema, paginationSchema } from "@/utils/zod-schema.js";
import { createRoute, z } from "@hono/zod-openapi";

export const getOrdersSchema = {
  query: listQuerySchema.extend({
    sort_by: orderSchemaFields.optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(orderSchemaOpenApi),
    total_records: z.number(),
    total_pages: z.number(),
    current_page: z.number(),
    next_page: z.number().nullable(),
    previous_page: z.number().nullable(),
  }),
};

export const getOrdersRoute = createRoute({
  middleware: [authenticationMiddleware(["ADMIN", "SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "get",
  path: "/orders",
  tags: ["Orders"],
  summary: "List all orders",
  description: "Retrieve a list of all orders.",
  request: {
    query: getOrdersSchema.query,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getOrdersSchema.response,
        },
      },
      description: "Orders retrieved successfully",
    },
  },
});

export const getOrdersRouteHandler: AppRouteHandler<
  typeof getOrdersRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const query = c.req.valid("query");

  const data = await getOrdersData({
    dbClient,
    limit: query?.limit,
    page: query?.page,
  });

  return c.json(data, { status: 200 });
};
