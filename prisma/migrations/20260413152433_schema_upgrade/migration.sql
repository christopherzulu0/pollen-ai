/*
  Warnings:

  - You are about to drop the `GroupBudget` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentRequestStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'TRANSFER_OUT';
ALTER TYPE "TransactionType" ADD VALUE 'TRANSFER_IN';
ALTER TYPE "TransactionType" ADD VALUE 'REQUEST';

-- DropForeignKey
ALTER TABLE "GroupBudget" DROP CONSTRAINT "GroupBudget_groupId_fkey";

-- AlterTable
ALTER TABLE "LoanRequest" ADD COLUMN     "originalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "totalRepaymentAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biometricLockEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kycCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kycDocumentUrls" JSONB,
ADD COLUMN     "kycDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "kycRejectedAt" TIMESTAMP(3),
ADD COLUMN     "kycRejectionReason" TEXT,
ADD COLUMN     "kycReuploadNote" TEXT,
ADD COLUMN     "kycReuploadRequestedAt" TIMESTAMP(3),
ADD COLUMN     "kycReuploadSlots" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "kycSubmittedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "GroupBudget";

-- CreateTable
CREATE TABLE "PaymentRequest" (
    "id" TEXT NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "recipientUserId" TEXT,
    "recipientIdentifier" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "status" "PaymentRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentRequest_requesterUserId_idx" ON "PaymentRequest"("requesterUserId");

-- CreateIndex
CREATE INDEX "PaymentRequest_recipientUserId_idx" ON "PaymentRequest"("recipientUserId");

-- CreateIndex
CREATE INDEX "PaymentRequest_status_idx" ON "PaymentRequest"("status");

-- CreateIndex
CREATE INDEX "PaymentRequest_createdAt_idx" ON "PaymentRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "PaymentRequest" ADD CONSTRAINT "PaymentRequest_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRequest" ADD CONSTRAINT "PaymentRequest_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
