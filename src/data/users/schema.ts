import type { User } from "@/db/schema.js";
import { UserRoleType } from "@/db/types.js";
import { z } from "@hono/zod-openapi";

export const userSchemaObject = {
  id: z.string().uuid(),
  mobile_number: z
    .string()
    .regex(
      /^09\d{9}$/,
      "Mobile number must be exactly 11 digits and start with 09"
    )
    .openapi({
      example: "09425291111",
    }),
  first_name: z.string().openapi({
    example: "John",
  }),
  middle_name: z.string().nullable().openapi({
    example: "Lee",
  }),
  last_name: z.string().openapi({
    example: "Doe",
  }),
  is_active: z.boolean().openapi({
    example: true,
  }),
  password: z.string().min(3).max(30).openapi({
    example: "P@ssw0rd",
  }),
  role: z.enum(UserRoleType).openapi({
    example: UserRoleType.USER,
  }),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  updated_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
};

export const userSchema = z.object(userSchemaObject) satisfies z.ZodType<User>;
export const userSchemaOpenApi = userSchema.openapi("User");
export const userSchemaFields = z.enum(
  Object.keys(userSchemaObject) as [string, ...string[]]
);

export type CreateUser = Omit<User, "id" | "created_at" | "updated_at">;
export type UpdateUser = Partial<User>;
