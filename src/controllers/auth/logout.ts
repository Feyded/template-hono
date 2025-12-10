import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import type { Session } from "@/types/auth.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";

const logoutSchema = {
  response: z
    .object({
      message: z.string(),
    })
    .openapi("Auth"),
};

export const logoutRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ cookieAuth: [] }],
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  summary: "User Logout",
  description: "user logout authentication",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: logoutSchema.response,
        },
      },
      description: "Log out successfully",
    },
  },
});

export const logoutRouteHandler: AppRouteHandler<typeof logoutRoute> = async (
  c
) => {

  setCookie(c, "auth__access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 0,
  });

  setCookie(c, "auth__refresh_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 0,
  });

  return c.json({ message: "Log out successfull!" }, StatusCodes.OK);
};
