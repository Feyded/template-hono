-- CreateEnum
CREATE TYPE "OrderPaymentMethod" AS ENUM ('CASH', 'GCASH', 'PAYMAYA');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_name" TEXT NOT NULL,
    "payment_method" "OrderPaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "image_path" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_payment_method_idx" ON "orders"("payment_method");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_updated_at_idx" ON "orders"("updated_at");
