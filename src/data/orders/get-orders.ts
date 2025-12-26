import type { DbClient } from "@/db/create-db-client.js";

export type GetOrdersDataArgs = {
  dbClient: DbClient;
  search?: string;
  limit?: number;
  page?: number;
  orderBy?: "asc" | "desc";
};

export async function getOrdersData({
  dbClient,
  search,
  limit = 10,
  page = 1,
  orderBy = "desc",
}: GetOrdersDataArgs) {
  let baseQuery = dbClient.selectFrom("orders");

  if (search) {
    baseQuery = baseQuery.where("customer_name", "ilike", `%${search}%`);
  }

  const records = await baseQuery
    .selectAll()
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("created_at", orderBy)
    .execute();

  const totalRecords = await baseQuery
    .select((eb) => eb.fn.count("id").as("total_records"))
    .executeTakeFirst();

  const totalPages = totalRecords?.total_records
    ? Math.ceil(Number(totalRecords?.total_records) / limit)
    : 0;

  return {
    records,
    total_records: Number(totalRecords?.total_records) ?? 0,
    total_pages: totalPages,
    current_page: page,
    next_page: page < totalPages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null,
  };
}
