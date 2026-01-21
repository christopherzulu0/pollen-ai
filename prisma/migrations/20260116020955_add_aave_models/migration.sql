-- CreateTable
CREATE TABLE "AavePosition" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "spokeAddress" TEXT,
    "totalSupplied" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalBorrowed" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableToBorrow" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "netAPY" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "healthFactor" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "liquidationThreshold" DECIMAL(65,30) NOT NULL DEFAULT 0.75,
    "liquidationRisk" TEXT NOT NULL DEFAULT 'low',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AavePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AaveAsset" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "apy" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ltv" DECIMAL(65,30) DEFAULT 0,
    "valueUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AaveAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AaveTransaction" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "txHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AaveTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AavePosition_groupId_idx" ON "AavePosition"("groupId");

-- CreateIndex
CREATE INDEX "AavePosition_healthFactor_idx" ON "AavePosition"("healthFactor");

-- CreateIndex
CREATE INDEX "AaveAsset_positionId_idx" ON "AaveAsset"("positionId");

-- CreateIndex
CREATE INDEX "AaveAsset_assetType_idx" ON "AaveAsset"("assetType");

-- CreateIndex
CREATE INDEX "AaveAsset_assetSymbol_idx" ON "AaveAsset"("assetSymbol");

-- CreateIndex
CREATE INDEX "AaveTransaction_positionId_idx" ON "AaveTransaction"("positionId");

-- CreateIndex
CREATE INDEX "AaveTransaction_type_idx" ON "AaveTransaction"("type");

-- CreateIndex
CREATE INDEX "AaveTransaction_timestamp_idx" ON "AaveTransaction"("timestamp");

-- CreateIndex
CREATE INDEX "AaveTransaction_status_idx" ON "AaveTransaction"("status");

-- AddForeignKey
ALTER TABLE "AavePosition" ADD CONSTRAINT "AavePosition_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AaveAsset" ADD CONSTRAINT "AaveAsset_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "AavePosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AaveTransaction" ADD CONSTRAINT "AaveTransaction_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "AavePosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
