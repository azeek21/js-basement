-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('GUEST', 'ADMIN', 'WAITER', 'ROBOT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'GUEST';
