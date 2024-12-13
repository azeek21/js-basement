-- CreateEnum
CREATE TYPE "GAME_PROGRESS_STATE" AS ENUM ('STARTED', 'ENDED', 'IN_PROGRESS', 'INITIALIZING', 'SETUP');

-- CreateEnum
CREATE TYPE "GAME_MODES" AS ENUM ('AGAINST_PC', 'AGAINST_PLAYER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cGames" INTEGER NOT NULL DEFAULT 0,
    "cWins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" SERIAL NOT NULL,
    "mode" "GAME_MODES" NOT NULL DEFAULT 'AGAINST_PC',
    "state" "GAME_PROGRESS_STATE" NOT NULL DEFAULT 'INITIALIZING',
    "winnerId" INTEGER NOT NULL,
    "shipPlacementPlayerA" TEXT NOT NULL,
    "shipPlacementPlayerB" TEXT NOT NULL,
    "turnOfUserId" INTEGER NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameSessionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_GameSessionToUser_AB_unique" ON "_GameSessionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameSessionToUser_B_index" ON "_GameSessionToUser"("B");

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_turnOfUserId_fkey" FOREIGN KEY ("turnOfUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSessionToUser" ADD CONSTRAINT "_GameSessionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSessionToUser" ADD CONSTRAINT "_GameSessionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
