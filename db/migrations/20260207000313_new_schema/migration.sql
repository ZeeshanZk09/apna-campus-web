/*
  Warnings:

  - The values [INSTITUTE] on the enum `ConversationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `instituteId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Cohort` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Fee` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the `Institute` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Cohort` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConversationType_new" AS ENUM ('DIRECT', 'GROUP', 'COURSE', 'COHORT', 'SYSTEM');
ALTER TABLE "public"."Conversation" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Conversation" ALTER COLUMN "type" TYPE "ConversationType_new" USING ("type"::text::"ConversationType_new");
ALTER TYPE "ConversationType" RENAME TO "ConversationType_old";
ALTER TYPE "ConversationType_new" RENAME TO "ConversationType";
DROP TYPE "public"."ConversationType_old";
ALTER TABLE "Conversation" ALTER COLUMN "type" SET DEFAULT 'DIRECT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Cohort" DROP CONSTRAINT "Cohort_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Fee" DROP CONSTRAINT "Fee_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Integration" DROP CONSTRAINT "Integration_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_instituteId_fkey";

-- DropIndex
DROP INDEX "Asset_instituteId_idx";

-- DropIndex
DROP INDEX "Cohort_instituteId_idx";

-- DropIndex
DROP INDEX "Cohort_instituteId_name_key";

-- DropIndex
DROP INDEX "Comment_instituteId_idx";

-- DropIndex
DROP INDEX "Conversation_instituteId_idx";

-- DropIndex
DROP INDEX "Course_instituteId_code_key";

-- DropIndex
DROP INDEX "Course_instituteId_idx";

-- DropIndex
DROP INDEX "Department_instituteId_idx";

-- DropIndex
DROP INDEX "Department_instituteId_name_key";

-- DropIndex
DROP INDEX "Fee_instituteId_idx";

-- DropIndex
DROP INDEX "Integration_instituteId_provider_idx";

-- DropIndex
DROP INDEX "Notification_userId_instituteId_idx";

-- DropIndex
DROP INDEX "Post_instituteId_idx";

-- DropIndex
DROP INDEX "Program_instituteId_idx";

-- DropIndex
DROP INDEX "Program_instituteId_name_key";

-- DropIndex
DROP INDEX "Setting_instituteId_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Cohort" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Integration" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "instituteId";

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "instituteId";

-- DropTable
DROP TABLE "Institute";

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_name_key" ON "Cohort"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_provider_key" ON "Integration"("provider");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
