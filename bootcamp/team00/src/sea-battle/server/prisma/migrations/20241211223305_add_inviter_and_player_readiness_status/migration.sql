-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "inviterId" INTEGER,
ADD COLUMN     "palyerAReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "palyerBReady" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
