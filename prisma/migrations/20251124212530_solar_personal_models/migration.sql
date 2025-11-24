/*
  Warnings:

  - You are about to drop the `UserDocuments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDocuments" DROP CONSTRAINT "UserDocuments_userId_fkey";

-- DropTable
DROP TABLE "UserDocuments";

-- CreateTable
CREATE TABLE "PersonalLoanDocuments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "Nrcfront" TEXT NOT NULL,
    "NrcBack" TEXT NOT NULL,
    "PaySlip" TEXT NOT NULL,
    "ProofOfAddress" TEXT,
    "LiveSelfie" TEXT,
    "BankStatement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalLoanDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarLoanDocuments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "Nrcfront" TEXT NOT NULL,
    "NrcBack" TEXT NOT NULL,
    "LandOwnership" TEXT NOT NULL,
    "UtilityBill" TEXT NOT NULL,
    "VendorQuotation" TEXT NOT NULL,
    "SubsidyReceipt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolarLoanDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalLoanDocuments_userId_key" ON "PersonalLoanDocuments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SolarLoanDocuments_userId_key" ON "SolarLoanDocuments"("userId");

-- AddForeignKey
ALTER TABLE "PersonalLoanDocuments" ADD CONSTRAINT "PersonalLoanDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarLoanDocuments" ADD CONSTRAINT "SolarLoanDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
