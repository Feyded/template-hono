import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { userSchema, userSchemaOpenApi } from "@/data/users/schema.js";
import { createRoute } from "@hono/zod-openapi";
import type { Session } from "@/types/auth.js";
import { updateUserData } from "@/data/users/update-user.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { AppRouteHandler } from "@/types/hono.js";

export const updateMyProfileSchema = {
  body: userSchema.pick({
    first_name: true,
    middle_name: true,
    last_name: true,
  }),
  response: userSchemaOpenApi.omit({password: true}),
};

export const updateMyProfileRoute = createRoute({
  middleware: [authenticationMiddleware()],
  security: [{ cookieAuth: [] }],
  method: "patch",
  path: "/me",
  tags: ["Me"],
  summary: "Update my details",
  description: "Update my details.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateMyProfileSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: updateMyProfileSchema.response,
        },
      },
      description: "My details updated successfully",
    },
  },
});

export const updateMyProfileRouteHandler: AppRouteHandler<
  typeof updateMyProfileRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const session = c.get("session") as Session;
  const body = c.req.valid("json");
  const user = await updateUserData({
    dbClient,
    id: session.id,
    payload: body,
  });

  return c.json(user, StatusCodes.CREATED);
};
