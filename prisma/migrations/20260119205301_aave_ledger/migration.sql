/*
  Warnings:

  - The values [CELO_BLOCKCHAIN] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `AaveAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsuranceClaim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsurancePolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsurancePremium` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsuranceProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId]` on the table `AavePosition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER', 'INTEREST', 'FEE', 'ADJUSTMENT', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'CONTRIBUTION', 'PENALTY');

-- CreateEnum
CREATE TYPE "LedgerStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "ExecutionType" AS ENUM ('BANK_TRANSFER', 'MOBILE_MONEY', 'BLOCKCHAIN');

-- CreateEnum
CREATE TYPE "ExecutionDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "VillageLedgerStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "VillageLedgerEntryType" AS ENUM ('CONTRIBUTION', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'PENALTY', 'INTEREST', 'FEE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "InterestPeriodType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "InterestFlowStatus" AS ENUM ('CALCULATED', 'DISTRIBUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "YieldSourceType" AS ENUM ('DEFI', 'TRADITIONAL', 'STAKING');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('PENDING', 'CREDITED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'MATCHED', 'ALERT', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('MISMATCH', 'PENDING_TRANSACTION', 'DUPLICATE', 'UNAUTHORIZED');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'CONTRIBUTION', 'INTEREST', 'FEE', 'PENALTY', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AaveAsset" DROP CONSTRAINT "AaveAsset_positionId_fkey";

-- DropForeignKey
ALTER TABLE "InsuranceClaim" DROP CONSTRAINT "InsuranceClaim_policyId_fkey";

-- DropForeignKey
ALTER TABLE "InsurancePolicy" DROP CONSTRAINT "InsurancePolicy_groupId_fkey";

-- DropForeignKey
ALTER TABLE "InsurancePolicy" DROP CONSTRAINT "InsurancePolicy_productId_fkey";

-- DropForeignKey
ALTER TABLE "InsurancePolicy" DROP CONSTRAINT "InsurancePolicy_userId_fkey";

-- DropForeignKey
ALTER TABLE "InsurancePremium" DROP CONSTRAINT "InsurancePremium_policyId_fkey";

-- DropIndex
DROP INDEX "AavePosition_healthFactor_idx";

-- DropIndex
DROP INDEX "AaveTransaction_status_idx";

-- AlterTable
ALTER TABLE "AavePosition" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "liquidationThreshold" SET DEFAULT 0;

-- DropTable
DROP TABLE "AaveAsset";

-- DropTable
DROP TABLE "InsuranceClaim";

-- DropTable
DROP TABLE "InsurancePolicy";

-- DropTable
DROP TABLE "InsurancePremium";

-- DropTable
DROP TABLE "InsuranceProduct";

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "type" "LedgerEntryType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "asset" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZMW',
    "userId" TEXT,
    "groupId" TEXT,
    "description" TEXT,
    "reference" TEXT,
    "txHash" TEXT,
    "blockNumber" INTEGER,
    "walletAddress" TEXT,
    "networkId" TEXT,
    "gasUsed" DECIMAL(65,30),
    "gasFee" DECIMAL(65,30),
    "status" "LedgerStatus" NOT NULL DEFAULT 'PENDING',
    "confirmations" INTEGER NOT NULL DEFAULT 0,
    "confirmedAt" TIMESTAMP(3),
    "reconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconciledAt" TIMESTAMP(3),
    "reconciliationId" TEXT,
    "reversalOfId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletExecution" (
    "id" TEXT NOT NULL,
    "executionType" "ExecutionType" NOT NULL,
    "direction" "ExecutionDirection" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "asset" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "fromAddress" TEXT,
    "toAddress" TEXT,
    "fromAccountName" TEXT,
    "toAccountName" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "mobileNumber" TEXT,
    "mobileProvider" TEXT,
    "txHash" TEXT,
    "blockNumber" INTEGER,
    "networkId" TEXT,
    "gasLimit" DECIMAL(65,30),
    "gasPrice" DECIMAL(65,30),
    "gasUsed" DECIMAL(65,30),
    "nonce" INTEGER,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VillageLedger" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "totalContributions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLoansIssued" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalRepayments" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalPenalties" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalInterestEarned" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalFeesCharged" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currentBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "activeMemberCount" INTEGER NOT NULL DEFAULT 0,
    "totalMemberCount" INTEGER NOT NULL DEFAULT 0,
    "status" "VillageLedgerStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VillageLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VillageLedgerEntry" (
    "id" TEXT NOT NULL,
    "villageLedgerId" TEXT NOT NULL,
    "type" "VillageLedgerEntryType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "runningBalance" DECIMAL(65,30) NOT NULL,
    "memberId" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "status" "LedgerStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VillageLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestFlow" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "periodType" "InterestPeriodType" NOT NULL,
    "savingsPrincipal" DECIMAL(65,30) NOT NULL,
    "grossInterest" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "platformFeeRate" DECIMAL(65,30) NOT NULL DEFAULT 0.10,
    "netInterestToUsers" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "InterestFlowStatus" NOT NULL DEFAULT 'CALCULATED',
    "distributedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterestFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YieldSource" (
    "id" TEXT NOT NULL,
    "interestFlowId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" "YieldSourceType" NOT NULL,
    "principalAmount" DECIMAL(65,30) NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "earnedAmount" DECIMAL(65,30) NOT NULL,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YieldSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestDistribution" (
    "id" TEXT NOT NULL,
    "interestFlowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT,
    "principalShare" DECIMAL(65,30) NOT NULL,
    "interestAmount" DECIMAL(65,30) NOT NULL,
    "feeDeducted" DECIMAL(65,30) NOT NULL,
    "netAmount" DECIMAL(65,30) NOT NULL,
    "status" "DistributionStatus" NOT NULL DEFAULT 'PENDING',
    "creditedAt" TIMESTAMP(3),
    "ledgerEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReconciliation" (
    "id" TEXT NOT NULL,
    "reconciliationDate" TIMESTAMP(3) NOT NULL,
    "ledgerBalance" DECIMAL(65,30) NOT NULL,
    "bankBalance" DECIMAL(65,30) NOT NULL,
    "blockchainBalance" DECIMAL(65,30) NOT NULL,
    "totalExecuted" DECIMAL(65,30) NOT NULL,
    "difference" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "differencePercent" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
    "matchedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReconciliationAlert" (
    "id" TEXT NOT NULL,
    "reconciliationId" TEXT NOT NULL,
    "alertType" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30),
    "relatedEntryIds" TEXT[],
    "relatedTxHashes" TEXT[],
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReconciliationAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fiatBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "fiatCurrency" TEXT NOT NULL DEFAULT 'ZMW',
    "celoBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cusdBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ceurBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lockedFiat" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lockedCelo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableFiat" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableCelo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalInterestEarned" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "pendingInterest" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "primaryWalletAddress" TEXT,
    "lastTransactionAt" TIMESTAMP(3),
    "lastInterestCreditAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubAsset" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contractAddress" TEXT,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "totalLiquidity" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableLiquidity" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "utilizationRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "supplyAPY" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "borrowAPY" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "baseRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "optimalUtilization" DECIMAL(65,30) NOT NULL DEFAULT 0.8,
    "ltv" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "liquidationThreshold" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "liquidationPenalty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canSupply" BOOLEAN NOT NULL DEFAULT true,
    "canBorrow" BOOLEAN NOT NULL DEFAULT true,
    "priceUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "priceUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HubAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AaveSupply" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "apy" DECIMAL(65,30) NOT NULL,
    "ltv" DECIMAL(65,30) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "valueUSD" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AaveSupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AaveBorrow" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "apy" DECIMAL(65,30) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "valueUSD" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AaveBorrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_entryId_key" ON "LedgerEntry"("entryId");

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_idx" ON "LedgerEntry"("userId");

-- CreateIndex
CREATE INDEX "LedgerEntry_groupId_idx" ON "LedgerEntry"("groupId");

-- CreateIndex
CREATE INDEX "LedgerEntry_type_idx" ON "LedgerEntry"("type");

-- CreateIndex
CREATE INDEX "LedgerEntry_status_idx" ON "LedgerEntry"("status");

-- CreateIndex
CREATE INDEX "LedgerEntry_currency_idx" ON "LedgerEntry"("currency");

-- CreateIndex
CREATE INDEX "LedgerEntry_createdAt_idx" ON "LedgerEntry"("createdAt");

-- CreateIndex
CREATE INDEX "LedgerEntry_reconciliationId_idx" ON "LedgerEntry"("reconciliationId");

-- CreateIndex
CREATE INDEX "WalletExecution_executionType_idx" ON "WalletExecution"("executionType");

-- CreateIndex
CREATE INDEX "WalletExecution_status_idx" ON "WalletExecution"("status");

-- CreateIndex
CREATE INDEX "WalletExecution_txHash_idx" ON "WalletExecution"("txHash");

-- CreateIndex
CREATE INDEX "WalletExecution_createdAt_idx" ON "WalletExecution"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VillageLedger_groupId_key" ON "VillageLedger"("groupId");

-- CreateIndex
CREATE INDEX "VillageLedger_groupId_idx" ON "VillageLedger"("groupId");

-- CreateIndex
CREATE INDEX "VillageLedger_status_idx" ON "VillageLedger"("status");

-- CreateIndex
CREATE INDEX "VillageLedgerEntry_villageLedgerId_idx" ON "VillageLedgerEntry"("villageLedgerId");

-- CreateIndex
CREATE INDEX "VillageLedgerEntry_memberId_idx" ON "VillageLedgerEntry"("memberId");

-- CreateIndex
CREATE INDEX "VillageLedgerEntry_type_idx" ON "VillageLedgerEntry"("type");

-- CreateIndex
CREATE INDEX "VillageLedgerEntry_createdAt_idx" ON "VillageLedgerEntry"("createdAt");

-- CreateIndex
CREATE INDEX "InterestFlow_periodStart_idx" ON "InterestFlow"("periodStart");

-- CreateIndex
CREATE INDEX "InterestFlow_periodEnd_idx" ON "InterestFlow"("periodEnd");

-- CreateIndex
CREATE INDEX "InterestFlow_status_idx" ON "InterestFlow"("status");

-- CreateIndex
CREATE INDEX "YieldSource_interestFlowId_idx" ON "YieldSource"("interestFlowId");

-- CreateIndex
CREATE INDEX "YieldSource_sourceType_idx" ON "YieldSource"("sourceType");

-- CreateIndex
CREATE INDEX "InterestDistribution_interestFlowId_idx" ON "InterestDistribution"("interestFlowId");

-- CreateIndex
CREATE INDEX "InterestDistribution_userId_idx" ON "InterestDistribution"("userId");

-- CreateIndex
CREATE INDEX "InterestDistribution_groupId_idx" ON "InterestDistribution"("groupId");

-- CreateIndex
CREATE INDEX "InterestDistribution_status_idx" ON "InterestDistribution"("status");

-- CreateIndex
CREATE INDEX "DailyReconciliation_status_idx" ON "DailyReconciliation"("status");

-- CreateIndex
CREATE INDEX "DailyReconciliation_reconciliationDate_idx" ON "DailyReconciliation"("reconciliationDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReconciliation_reconciliationDate_key" ON "DailyReconciliation"("reconciliationDate");

-- CreateIndex
CREATE INDEX "ReconciliationAlert_reconciliationId_idx" ON "ReconciliationAlert"("reconciliationId");

-- CreateIndex
CREATE INDEX "ReconciliationAlert_alertType_idx" ON "ReconciliationAlert"("alertType");

-- CreateIndex
CREATE INDEX "ReconciliationAlert_severity_idx" ON "ReconciliationAlert"("severity");

-- CreateIndex
CREATE INDEX "ReconciliationAlert_status_idx" ON "ReconciliationAlert"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MemberBalance_userId_key" ON "MemberBalance"("userId");

-- CreateIndex
CREATE INDEX "MemberBalance_userId_idx" ON "MemberBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HubAsset_symbol_key" ON "HubAsset"("symbol");

-- CreateIndex
CREATE INDEX "HubAsset_symbol_idx" ON "HubAsset"("symbol");

-- CreateIndex
CREATE INDEX "HubAsset_isActive_idx" ON "HubAsset"("isActive");

-- CreateIndex
CREATE INDEX "AaveSupply_positionId_idx" ON "AaveSupply"("positionId");

-- CreateIndex
CREATE INDEX "AaveSupply_assetSymbol_idx" ON "AaveSupply"("assetSymbol");

-- CreateIndex
CREATE INDEX "AaveBorrow_positionId_idx" ON "AaveBorrow"("positionId");

-- CreateIndex
CREATE INDEX "AaveBorrow_assetSymbol_idx" ON "AaveBorrow"("assetSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "AavePosition_groupId_key" ON "AavePosition"("groupId");

-- CreateIndex
CREATE INDEX "AavePosition_spokeAddress_idx" ON "AavePosition"("spokeAddress");

-- CreateIndex
CREATE INDEX "AavePosition_isActive_idx" ON "AavePosition"("isActive");

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES "DailyReconciliation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_reversalOfId_fkey" FOREIGN KEY ("reversalOfId") REFERENCES "LedgerEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VillageLedger" ADD CONSTRAINT "VillageLedger_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VillageLedgerEntry" ADD CONSTRAINT "VillageLedgerEntry_villageLedgerId_fkey" FOREIGN KEY ("villageLedgerId") REFERENCES "VillageLedger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldSource" ADD CONSTRAINT "YieldSource_interestFlowId_fkey" FOREIGN KEY ("interestFlowId") REFERENCES "InterestFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestDistribution" ADD CONSTRAINT "InterestDistribution_interestFlowId_fkey" FOREIGN KEY ("interestFlowId") REFERENCES "InterestFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestDistribution" ADD CONSTRAINT "InterestDistribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReconciliationAlert" ADD CONSTRAINT "ReconciliationAlert_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES "DailyReconciliation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberBalance" ADD CONSTRAINT "MemberBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AaveSupply" ADD CONSTRAINT "AaveSupply_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "AavePosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AaveBorrow" ADD CONSTRAINT "AaveBorrow_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "AavePosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
