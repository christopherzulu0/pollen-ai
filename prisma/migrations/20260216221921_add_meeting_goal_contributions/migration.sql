-- CreateTable
CREATE TABLE "MeetingGoalContribution" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingGoalContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeetingGoalContribution_goalId_idx" ON "MeetingGoalContribution"("goalId");

-- CreateIndex
CREATE INDEX "MeetingGoalContribution_membershipId_idx" ON "MeetingGoalContribution"("membershipId");

-- AddForeignKey
ALTER TABLE "MeetingGoalContribution" ADD CONSTRAINT "MeetingGoalContribution_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "MeetingFinancialGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingGoalContribution" ADD CONSTRAINT "MeetingGoalContribution_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
