-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_turnOfUserId_fkey";

-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_winnerId_fkey";

-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "winnerId" DROP NOT NULL,
ALTER COLUMN "turnOfUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_turnOfUserId_fkey" FOREIGN KEY ("turnOfUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
