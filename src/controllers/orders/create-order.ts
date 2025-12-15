import { createOrderData } from "@/data/orders/create-order.js";
import { orderSchema, orderSchemaOpenApi } from "@/data/orders/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

export const createOrderSchema = {
  body: orderSchema.pick({
    customer_name: true,
    payment_method: true,
    status: true,
    image_path: true,
    amount: true,
  }),
  response: orderSchemaOpenApi,
};

export const createOrderRoute = createRoute({
  middleware: [authenticationMiddleware(["ADMIN", "SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "post",
  path: "/orders",
  tags: ["Orders"],
  summary: "Create a order",
  description: "Create a new order.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createOrderSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: createOrderSchema.response,
        },
      },
      description: "Order created successfully",
    },
  },
});

export const createOrderRouteHandler: AppRouteHandler<
  typeof createOrderRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const body = c.req.valid("json");

  const order = await createOrderData({ dbClient, payload: body });
  return c.json(order, StatusCodes.CREATED);
};
