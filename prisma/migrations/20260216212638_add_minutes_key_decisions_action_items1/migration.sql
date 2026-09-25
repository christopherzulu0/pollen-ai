-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "minutesActionItemsCompleted" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[];
