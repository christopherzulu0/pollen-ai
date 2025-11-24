-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "nationalId" TEXT;

-- CreateTable
CREATE TABLE "IndividualLoan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceCategory" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "purpose" TEXT NOT NULL,
    "repaymentPeriod" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "monthlyIncome" DECIMAL(65,30),
    "businessDetails" TEXT,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndividualLoan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IndividualLoan_userId_idx" ON "IndividualLoan"("userId");

-- CreateIndex
CREATE INDEX "IndividualLoan_status_idx" ON "IndividualLoan"("status");

-- AddForeignKey
ALTER TABLE "IndividualLoan" ADD CONSTRAINT "IndividualLoan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
