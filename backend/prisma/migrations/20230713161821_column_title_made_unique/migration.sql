/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Column` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Column_title_key" ON "Column"("title");
