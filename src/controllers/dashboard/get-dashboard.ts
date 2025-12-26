import { dashboardSchema } from "@/data/dashboard/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import { getDashboardService } from "@/services/dashboard/get-dashboard.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute } from "@hono/zod-openapi";

export const getDashboardSchema = {
  response: dashboardSchema,
};

export const getDashboardRoute = createRoute({
  middleware: [authenticationMiddleware(["SUPER_ADMIN"])],
  security: [{ cookieAuth: [] }],
  method: "get",
  path: "/dashboard",
  tags: ["Dashboard"],
  summary: "Dashboard summary",
  description: "Retrieve a dashboard details.",

  responses: {
    200: {
      content: {
        "application/json": {
          schema: getDashboardSchema.response,
        },
      },
      description: "Dashboard retrieved successfully",
    },
  },
});

export const getDashboardRouteHandler: AppRouteHandler<
  typeof getDashboardRoute
> = async (c) => {
  const dbClient = c.get("dbClient");

  const data = await getDashboardService({
    dbClient,
  });

  return c.json(data, { status: 200 });
};
