-- AlterTable
ALTER TABLE "BlogComment" ADD COLUMN     "analyzedAt" TIMESTAMP(3),
ADD COLUMN     "emotions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sentiment" TEXT,
ADD COLUMN     "sentimentConfidence" DOUBLE PRECISION,
ADD COLUMN     "sentimentScore" DOUBLE PRECISION;
