-- CreateTable
CREATE TABLE "UserDocuments" (
    "id" TEXT NOT NULL,
    "Nrcfront" TEXT NOT NULL,
    "NrcBack" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "PaySlip" TEXT NOT NULL,
    "Ownershipproof" TEXT,
    "HarvestProof" TEXT,

    CONSTRAINT "UserDocuments_pkey" PRIMARY KEY ("id")
);
