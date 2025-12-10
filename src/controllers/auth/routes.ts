import type { HonoEnv } from "@/types/hono.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRoute, loginRouteHandler } from "./login.js";
import { logoutRoute, logoutRouteHandler } from "./logout.js";

const authRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(loginRoute, loginRouteHandler)
  .openapi(logoutRoute, logoutRouteHandler);

export default authRoutes;
