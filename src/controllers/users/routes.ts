import type { HonoEnv } from "@/types/hono.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getUsersRoute, getUsersRouteHandler } from "./get-users.js";
import { getUserRoute, getUserRouteHandler } from "./get-user.js";
import { createUserRoute, createUserRouteHandler } from "./create-user.js";
import { updateUserRoute, updateUserRouteHandler } from "./update-user.js";
import { updateUserPasswordRoute, updateUserPasswordRouteHandler } from "./update-user-password.js";

const usersRoutes = new OpenAPIHono<HonoEnv>();
usersRoutes
  .openapi(getUserRoute, getUserRouteHandler)
  .openapi(getUsersRoute, getUsersRouteHandler)
  .openapi(createUserRoute, createUserRouteHandler)
  .openapi(updateUserRoute, updateUserRouteHandler)
  .openapi(updateUserPasswordRoute, updateUserPasswordRouteHandler);

export default usersRoutes;
