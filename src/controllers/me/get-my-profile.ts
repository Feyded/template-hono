import { getUserData } from "@/data/users/get-user.js";
import { userSchemaOpenApi } from "@/data/users/schema.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";
import type { Session } from "@/types/auth.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute, type z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

export const getMyProfileSchema = {
  response: userSchemaOpenApi.pick({
    id: true,
    first_name: true,
    middle_name: true,
    last_name: true,
    role: true,
    is_active: true,
    mobile_number: true,
    created_at: true,
    updated_at: true,
  }),
};

export type GetMyProfileResponse = z.infer<typeof getMyProfileSchema.response>;

export const getMyProfileRoute = createRoute({
  middleware: [authenticationMiddleware()],
  security: [{ cookieAuth: [] }],
  method: "get",
  path: "/me",
  tags: ["Me"],
  summary: "Retrieve my profile",
  description: "Retrieve your profile.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getMyProfileSchema.response,
        },
      },
      description: "My profile retrieved successfully",
    },
  },
});

export const getMyProfileRouteHandler: AppRouteHandler<
  typeof getMyProfileRoute
> = async (c) => {
  const dbClient = c.get("dbClient");
  const session = c.get("session") as Session;
  const myProfile = await getUserData({ dbClient, id: session.id });

  return c.json(myProfile, StatusCodes.OK);
};
