/*
  Warnings:

  - You are about to drop the column `palyerAReady` on the `GameSession` table. All the data in the column will be lost.
  - You are about to drop the column `palyerBReady` on the `GameSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameSession" DROP COLUMN "palyerAReady",
DROP COLUMN "palyerBReady",
ADD COLUMN     "playerAReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "playerBReady" BOOLEAN NOT NULL DEFAULT false;
