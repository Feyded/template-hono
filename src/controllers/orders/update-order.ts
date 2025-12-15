import { orderSchema, orderSchemaOpenApi } from "@/data/orders/schema.js";
import { updateOrderData } from "@/data/orders/update-order.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

export const updateOrderSchema = {
  params: z.object({
    order_id: z
      .string()
      .uuid()
      .openapi({
        param: { name: "order_id", in: "path" },
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
  }),
  body: orderSchema.pick({
    customer_name: true,
    payment_method: true,
    status: true,
    image_path: true,
    amount: true,
  }),
  response: orderSchemaOpenApi,
};

export const updateOrderRoute = createRoute({
  middleware: [authenticationMiddleware(["ADMIN", "SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "patch",
  path: "/orders/{order_id}",
  tags: ["Orders"],
  summary: "Update an order",
  description: "Update an order.",
  request: {
    params: updateOrderSchema.params,
    body: {
      content: {
        "application/json": {
          schema: updateOrderSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: updateOrderSchema.response,
        },
      },
      description: "Order updated successfully",
    },
  },
});

export const updateOrderRouteHandler: AppRouteHandler<
  typeof updateOrderRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const param = c.req.valid("param");
  const body = c.req.valid("json");

  const order = await updateOrderData({
    dbClient,
    id: param.order_id,
    payload: body,
  });
  return c.json(order, StatusCodes.OK);
};
