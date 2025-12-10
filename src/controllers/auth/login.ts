import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "@hono/zod-openapi";
import { loginService } from "@/services/auth/login.js";
import { setCookie } from "hono/cookie";

const loginSchema = {
  body: z.object({
    email: z.email().openapi({
      example: "john.doe@example.com",
    }),
    password: z.string().openapi({
      example: "Password",
    }),
  }),
  response: z
    .object({
      access_token: z.string(),
      refresh_token: z.string(),
    })
    .openapi("Auth"),
};

export const loginRoute = createRoute({
  middleware: [],
  security: [{ cookieAuth: [] }],
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "User Login",
  description: "user login authentication",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: loginSchema.response,
        },
      },
      description: "Log in successfully",
    },
  },
});

export const loginRouteHandler: AppRouteHandler<typeof loginRoute> = async (
  c
) => {
  const dbClient = c.get("dbClient");
  const body = c.req.valid("json");

  const tokens = await loginService({
    dbClient,
    email: body.email,
    password: body.password,
  });

  setCookie(c, "auth__access_token", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  setCookie(c, "auth__refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return c.json(
    { access_token: tokens.accessToken, refresh_token: tokens.refreshToken },
    StatusCodes.OK
  );
};
