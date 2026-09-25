/*
  Warnings:

  - The `agenda` column on the `Meeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "agenda",
ADD COLUMN     "agenda" TEXT[] DEFAULT ARRAY[]::TEXT[];
