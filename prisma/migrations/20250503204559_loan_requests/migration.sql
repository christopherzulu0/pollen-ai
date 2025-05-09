-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'REPAYING', 'REPAID', 'DEFAULTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'LOAN_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE 'LOAN_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'LOAN_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE 'LOAN_REPAYMENT_DUE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'LOAN_DISBURSEMENT';
ALTER TYPE "TransactionType" ADD VALUE 'LOAN_REPAYMENT';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "relatedLoanRequestId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "loanRequestId" TEXT;

-- CreateTable
CREATE TABLE "LoanRequest" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "purpose" TEXT NOT NULL,
    "repaymentDate" TIMESTAMP(3) NOT NULL,
    "repaymentTerms" TEXT NOT NULL,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "interestRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "LoanRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanVote" (
    "id" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "loanRequestId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,

    CONSTRAINT "LoanVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoanVote_userId_loanRequestId_key" ON "LoanVote"("userId", "loanRequestId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_loanRequestId_fkey" FOREIGN KEY ("loanRequestId") REFERENCES "LoanRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRequest" ADD CONSTRAINT "LoanRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRequest" ADD CONSTRAINT "LoanRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanVote" ADD CONSTRAINT "LoanVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanVote" ADD CONSTRAINT "LoanVote_loanRequestId_fkey" FOREIGN KEY ("loanRequestId") REFERENCES "LoanRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanVote" ADD CONSTRAINT "LoanVote_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
