-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "minutesActionItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "minutesKeyDecisions" TEXT[] DEFAULT ARRAY[]::TEXT[];
