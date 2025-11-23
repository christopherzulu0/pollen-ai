/*
  Warnings:

  - A unique constraint covering the columns `[celoAddress]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "celoAddress" TEXT,
ADD COLUMN     "celoBalance" TEXT DEFAULT '0',
ADD COLUMN     "ceurBalance" TEXT DEFAULT '0',
ADD COLUMN     "connectedAt" TIMESTAMP(3),
ADD COLUMN     "cusdBalance" TEXT DEFAULT '0',
ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "network" TEXT DEFAULT 'alfajores';

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_celoAddress_key" ON "Wallet"("celoAddress");
