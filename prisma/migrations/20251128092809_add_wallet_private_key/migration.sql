-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "privateKey" TEXT;

-- CreateTable
CREATE TABLE "AIGoalAnalysis" (
    "id" TEXT NOT NULL,
    "savingsGoalId" TEXT NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "scoreCategory" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "recommendations" TEXT[],
    "predictedCompletionDate" TIMESTAMP(3) NOT NULL,
    "onTrack" BOOLEAN NOT NULL,
    "confidence" INTEGER NOT NULL,
    "progressPercentage" DECIMAL(65,30) NOT NULL,
    "avgMonthlyContribution" DECIMAL(65,30) NOT NULL,
    "requiredMonthlyContribution" DECIMAL(65,30) NOT NULL,
    "daysUntilDeadline" INTEGER NOT NULL,
    "remainingAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIGoalAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIGoalAnalysis_savingsGoalId_idx" ON "AIGoalAnalysis"("savingsGoalId");

-- CreateIndex
CREATE INDEX "AIGoalAnalysis_createdAt_idx" ON "AIGoalAnalysis"("createdAt");

-- AddForeignKey
ALTER TABLE "AIGoalAnalysis" ADD CONSTRAINT "AIGoalAnalysis_savingsGoalId_fkey" FOREIGN KEY ("savingsGoalId") REFERENCES "SavingsGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
