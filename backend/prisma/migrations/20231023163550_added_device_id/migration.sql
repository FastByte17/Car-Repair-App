/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_deviceId_key" ON "User"("deviceId");
