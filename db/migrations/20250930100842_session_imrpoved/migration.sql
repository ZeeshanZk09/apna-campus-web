-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Session" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
