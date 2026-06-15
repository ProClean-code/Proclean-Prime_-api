/*
  Warnings:

  - Added the required column `amount` to the `PaymentOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentOrder" ADD COLUMN     "amount" INTEGER NOT NULL;
