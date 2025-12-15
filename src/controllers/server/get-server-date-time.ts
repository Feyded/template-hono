import { getServerDateTimeData } from "@/data/server/get-server-date-time.js";
import type { AppRouteHandler } from "@/types/hono.js";
import { createRoute, z } from "@hono/zod-openapi";

export const getServerDateTimeSchema = {
  response: z.string().openapi({
    example: "2022-12-10T03:00:56.258Z",
  }),
};

export type GetServerDateTimeResponse = z.infer<
  typeof getServerDateTimeSchema.response
>;

export const getServerDateTimeRoute = createRoute({
  middleware: [],
  method: "get",
  path: "/server/date-time",
  tags: ["Server"],
  summary: "Retrieve the server date time",
  description: "Retrieve the server date time.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getServerDateTimeSchema.response,
        },
      },
      description: "Server date time retrieved successfully",
    },
  },
});

export const getServerDateTimeRouteHandler: AppRouteHandler<
  typeof getServerDateTimeRoute
> = async (c) => {
  const dbClient = c.get("dbClient");

  const serverDateTime = await getServerDateTimeData({ dbClient });

  return c.json(serverDateTime, { status: 200 });
};
