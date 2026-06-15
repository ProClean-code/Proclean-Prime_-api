/*
  Warnings:

  - The values [FAILED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - The `fechas` column on the `PaymentOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."PaymentOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PaymentOrder" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "PaymentOrder" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "PaymentOrder" DROP COLUMN "fechas",
ADD COLUMN     "fechas" TEXT[];
