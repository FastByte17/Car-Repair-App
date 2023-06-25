-- CreateEnum
CREATE TYPE "State" AS ENUM ('IN_PROGRESS', 'ON_HOLD', 'CAR_WASH', 'DONE');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "state" "State" NOT NULL DEFAULT 'IN_PROGRESS';
