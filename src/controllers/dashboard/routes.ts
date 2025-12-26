import type { HonoEnv } from "@/types/hono.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getDashboardRoute, getDashboardRouteHandler } from "./get-dashboard.js";

const dsahboardRoutes = new OpenAPIHono<HonoEnv>();
dsahboardRoutes.openapi(getDashboardRoute, getDashboardRouteHandler);

export default dsahboardRoutes;
