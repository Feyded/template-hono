import type { DbClient } from "@/db/create-db-client.js";

type GetDashboardServiceArgs = {
  dbClient: DbClient;
};

export async function getDashboardService({
  dbClient,
}: GetDashboardServiceArgs) {
  const baseQuery = dbClient.selectFrom("orders");
  const dashboard = await baseQuery
    .select([
      dbClient.fn.count("id").as("total_orders"),
      dbClient.fn.sum("amount").as("total_money"),
      dbClient.fn
        .count("id")
        .filterWhere("status", "=", "PENDING")
        .as("waiting_orders"),
      dbClient.fn
        .count("id")
        .filterWhere("status", "=", "PAID")
        .as("finished_orders"),
    ])
    .executeTakeFirst();

  const result = {
    total_orders: Number(dashboard?.total_orders ?? 0),
    total_money: Number(dashboard?.total_money ?? 0),
    waiting_orders: Number(dashboard?.waiting_orders ?? 0),
    finished_orders: Number(dashboard?.finished_orders ?? 0),
  };

  return result;
}
