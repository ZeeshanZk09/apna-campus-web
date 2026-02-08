/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BorrowRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HealthRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentTransport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransportRoute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "BorrowRecord" DROP CONSTRAINT "BorrowRecord_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BorrowRecord" DROP CONSTRAINT "BorrowRecord_userId_fkey";

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_cohortId_fkey";

-- DropForeignKey
ALTER TABLE "HealthRecord" DROP CONSTRAINT "HealthRecord_userId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_itemId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTransport" DROP CONSTRAINT "StudentTransport_routeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTransport" DROP CONSTRAINT "StudentTransport_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_routeId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "gradedById" UUID,
ADD COLUMN     "marks" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "BorrowRecord";

-- DropTable
DROP TABLE "Classroom";

-- DropTable
DROP TABLE "HealthRecord";

-- DropTable
DROP TABLE "InventoryItem";

-- DropTable
DROP TABLE "InventoryTransaction";

-- DropTable
DROP TABLE "StudentTransport";

-- DropTable
DROP TABLE "TransportRoute";

-- DropTable
DROP TABLE "Vehicle";
