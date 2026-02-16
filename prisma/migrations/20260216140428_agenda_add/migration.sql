-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "chairpersonMembershipId" TEXT,
ADD COLUMN     "noteTakerMembershipId" TEXT;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_chairpersonMembershipId_fkey" FOREIGN KEY ("chairpersonMembershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_noteTakerMembershipId_fkey" FOREIGN KEY ("noteTakerMembershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
