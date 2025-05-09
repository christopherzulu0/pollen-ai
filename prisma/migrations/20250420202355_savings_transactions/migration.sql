-- CreateTable
CREATE TABLE "SavingsTransaction" (
    "id" TEXT NOT NULL,
    "savingsGoalId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingsTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavingsTransaction_savingsGoalId_idx" ON "SavingsTransaction"("savingsGoalId");

-- AddForeignKey
ALTER TABLE "SavingsTransaction" ADD CONSTRAINT "SavingsTransaction_savingsGoalId_fkey" FOREIGN KEY ("savingsGoalId") REFERENCES "SavingsGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
