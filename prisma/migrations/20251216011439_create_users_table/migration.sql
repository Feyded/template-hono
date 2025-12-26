-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "role" "UserRoleType" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "mobile_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_number_key" ON "users"("mobile_number");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_updated_at_idx" ON "users"("updated_at");

-- CreateIndex
CREATE INDEX "users_first_name_idx" ON "users"("first_name");

-- CreateIndex
CREATE INDEX "users_last_name_idx" ON "users"("last_name");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_mobile_number_idx" ON "users"("mobile_number");
