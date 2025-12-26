import type { Order } from "@/db/schema.js";
import { OrderPaymentMethod, OrderStatus } from "@/db/types.js";
import { z } from "@hono/zod-openapi";

export const orderSchemaObject = {
  id: z.string().uuid(),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  updated_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  customer_name: z.string().openapi({
    example: "John Doe",
  }),
  payment_method: z.enum(OrderPaymentMethod).openapi({
    example: OrderPaymentMethod.CASH,
  }),
  status: z.enum(OrderStatus).openapi({
    example: OrderStatus.PENDING,
  }),
  image_path: z.string().nullable().openapi({
    example: "/public/uploads/sample.png",
  }),
  amount: z.coerce.number().openapi({
    example: 175.0,
  }),
};

export const orderSchema = z.object(
  orderSchemaObject
) satisfies z.ZodType<Order>;
export const orderSchemaOpenApi = orderSchema.openapi("Order");
export const orderSchemaFields = z.enum(
  Object.keys(orderSchemaObject) as [string, ...string[]]
);

export type CreateOrder = Omit<Order, "id" | "created_at" | "updated_at">;
export type UpdateOrder = Partial<Order>;
