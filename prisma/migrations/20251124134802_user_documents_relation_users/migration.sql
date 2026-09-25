/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `UserDocuments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserDocuments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `UserDocuments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDocuments" DROP COLUMN "phoneNumber",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserDocuments_userId_key" ON "UserDocuments"("userId");

-- AddForeignKey
ALTER TABLE "UserDocuments" ADD CONSTRAINT "UserDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
