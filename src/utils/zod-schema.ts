import { z } from "zod";

export const paginationSchema = z.object({
  total_records: z.number(),
  total_pages: z.number(),
  current_page: z.number(),
  next_page: z.number().nullable(),
  previous_page: z.number().nullable(),
});

export const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  order_by: z.enum(["asc", "desc"]).optional(),
});
