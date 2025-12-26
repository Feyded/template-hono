import { z } from "zod";

export const dashboardSchemaObject = {
  total_money: z.coerce.number().openapi({
    example: 15000.75,
    description: "Total amount of all orders",
  }),
  total_orders: z.coerce.number().openapi({
    example: 120,
    description: "Total number of orders",
  }),
  waiting_orders: z.coerce.number().openapi({
    example: 25,
    description: "Number of orders that are still waiting or pending",
  }),
  finished_orders: z.coerce.number().openapi({
    example: 95,
    description: "Number of orders that are completed",
  }),
};

export const dashboardSchema = z.object(dashboardSchemaObject);
export const dashboardSchemaOpenApi = dashboardSchema.openapi("Dashboard");
export const dashboardSchemaFields = z.enum(
  Object.keys(dashboardSchemaObject) as [string, ...string[]]
);
