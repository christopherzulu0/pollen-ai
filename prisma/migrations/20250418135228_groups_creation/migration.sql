/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "GroupPrivacy" AS ENUM ('PUBLIC', 'PRIVATE', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "GovernanceType" AS ENUM ('ADMIN', 'MULTI_ADMIN', 'ONE_VOTE_PER_PERSON', 'ONE_VOTE_DEPOSIT');

-- CreateEnum
CREATE TYPE "ContributionFrequency" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "MeetingFrequency" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'CONTRIBUTION', 'INTEREST', 'FEE', 'PENALTY');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PENDING', 'PRESENT', 'ABSENT', 'EXCUSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT_DUE', 'PAYMENT_RECEIVED', 'NEW_MEMBER', 'MEETING_REMINDER', 'WITHDRAWAL_REQUEST', 'SYSTEM');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "privacy" "GroupPrivacy" NOT NULL DEFAULT 'PRIVATE',
    "governanceType" "GovernanceType" NOT NULL DEFAULT 'ADMIN',
    "contributionAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionFrequency" "ContributionFrequency" NOT NULL DEFAULT 'MONTHLY',
    "depositGoal" DECIMAL(65,30),
    "latePenaltyFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "gracePeriod" INTEGER NOT NULL DEFAULT 3,
    "interestRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "allowEarlyWithdrawal" BOOLEAN NOT NULL DEFAULT false,
    "earlyWithdrawalFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "requireApproval" BOOLEAN NOT NULL DEFAULT true,
    "autoReminders" BOOLEAN NOT NULL DEFAULT true,
    "votingThreshold" INTEGER NOT NULL DEFAULT 50,
    "allowLateJoining" BOOLEAN NOT NULL DEFAULT true,
    "groupDuration" INTEGER,
    "maxMembers" INTEGER,
    "meetingFrequency" "MeetingFrequency" NOT NULL DEFAULT 'WEEKLY',
    "groupRules" TEXT,
    "bylaws" TEXT,
    "tags" TEXT,
    "status" "GroupStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalContributed" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastContribution" TIMESTAMP(3),

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT,
    "momoNumber" TEXT,
    "reference" TEXT,
    "feeAmount" DECIMAL(65,30),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalSavings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalSavings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsGoal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetAmount" DECIMAL(65,30) NOT NULL,
    "currentAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SavingsGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAttendee" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "MeetingAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "options" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "membershipId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteResult" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoteResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "relatedGroupId" TEXT,
    "relatedTransactionId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupInvitation" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "GroupInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_groupId_key" ON "Membership"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalSavings_userId_key" ON "PersonalSavings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingAttendee_meetingId_membershipId_key" ON "MeetingAttendee"("meetingId", "membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "VoteResult_voteId_membershipId_key" ON "VoteResult"("voteId", "membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupInvitation_code_key" ON "GroupInvitation"("code");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalSavings" ADD CONSTRAINT "PersonalSavings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsGoal" ADD CONSTRAINT "SavingsGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendee" ADD CONSTRAINT "MeetingAttendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendee" ADD CONSTRAINT "MeetingAttendee_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteResult" ADD CONSTRAINT "VoteResult_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteResult" ADD CONSTRAINT "VoteResult_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvitation" ADD CONSTRAINT "GroupInvitation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvitation" ADD CONSTRAINT "GroupInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvitation" ADD CONSTRAINT "GroupInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
