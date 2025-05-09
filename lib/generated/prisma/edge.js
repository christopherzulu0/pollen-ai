
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  clerkUserId: 'clerkUserId',
  password: 'password',
  avatar: 'avatar',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isAdmin: 'isAdmin'
};

exports.Prisma.GroupScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  logo: 'logo',
  groupCode: 'groupCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId',
  privacy: 'privacy',
  governanceType: 'governanceType',
  contributionAmount: 'contributionAmount',
  contributionFrequency: 'contributionFrequency',
  depositGoal: 'depositGoal',
  latePenaltyFee: 'latePenaltyFee',
  gracePeriod: 'gracePeriod',
  interestRate: 'interestRate',
  allowEarlyWithdrawal: 'allowEarlyWithdrawal',
  earlyWithdrawalFee: 'earlyWithdrawalFee',
  requireApproval: 'requireApproval',
  autoReminders: 'autoReminders',
  votingThreshold: 'votingThreshold',
  allowLateJoining: 'allowLateJoining',
  groupDuration: 'groupDuration',
  maxMembers: 'maxMembers',
  meetingFrequency: 'meetingFrequency',
  groupRules: 'groupRules',
  bylaws: 'bylaws',
  tags: 'tags',
  status: 'status'
};

exports.Prisma.MembershipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  groupId: 'groupId',
  role: 'role',
  joinedAt: 'joinedAt',
  status: 'status',
  balance: 'balance',
  totalContributed: 'totalContributed',
  lastContribution: 'lastContribution'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  type: 'type',
  status: 'status',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  groupId: 'groupId',
  momoNumber: 'momoNumber',
  reference: 'reference',
  feeAmount: 'feeAmount',
  walletId: 'walletId',
  loanRequestId: 'loanRequestId'
};

exports.Prisma.PersonalSavingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SavingsGoalScalarFieldEnum = {
  id: 'id',
  name: 'name',
  targetAmount: 'targetAmount',
  currentAmount: 'currentAmount',
  deadline: 'deadline',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  isCompleted: 'isCompleted'
};

exports.Prisma.SavingsTransactionScalarFieldEnum = {
  id: 'id',
  savingsGoalId: 'savingsGoalId',
  amount: 'amount',
  type: 'type',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MeetingScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  date: 'date',
  location: 'location',
  isVirtual: 'isVirtual',
  meetingLink: 'meetingLink',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  groupId: 'groupId'
};

exports.Prisma.MeetingAttendeeScalarFieldEnum = {
  id: 'id',
  meetingId: 'meetingId',
  membershipId: 'membershipId',
  status: 'status'
};

exports.Prisma.VoteScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  options: 'options',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  membershipId: 'membershipId'
};

exports.Prisma.VoteResultScalarFieldEnum = {
  id: 'id',
  voteId: 'voteId',
  membershipId: 'membershipId',
  selectedOption: 'selectedOption',
  votedAt: 'votedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  type: 'type',
  isRead: 'isRead',
  createdAt: 'createdAt',
  userId: 'userId',
  relatedGroupId: 'relatedGroupId',
  relatedTransactionId: 'relatedTransactionId',
  relatedLoanRequestId: 'relatedLoanRequestId'
};

exports.Prisma.GroupInvitationScalarFieldEnum = {
  id: 'id',
  groupId: 'groupId',
  inviterId: 'inviterId',
  inviteeId: 'inviteeId',
  status: 'status',
  code: 'code',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContributionScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  groupId: 'groupId',
  transactionId: 'transactionId'
};

exports.Prisma.LoanRequestScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  purpose: 'purpose',
  repaymentDate: 'repaymentDate',
  repaymentTerms: 'repaymentTerms',
  installments: 'installments',
  interestRate: 'interestRate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  groupId: 'groupId'
};

exports.Prisma.LoanVoteScalarFieldEnum = {
  id: 'id',
  vote: 'vote',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  loanRequestId: 'loanRequestId',
  membershipId: 'membershipId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.GroupPrivacy = exports.$Enums.GroupPrivacy = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  INVITE_ONLY: 'INVITE_ONLY'
};

exports.GovernanceType = exports.$Enums.GovernanceType = {
  ADMIN: 'ADMIN',
  MULTI_ADMIN: 'MULTI_ADMIN',
  ONE_VOTE_PER_PERSON: 'ONE_VOTE_PER_PERSON',
  ONE_VOTE_DEPOSIT: 'ONE_VOTE_DEPOSIT'
};

exports.ContributionFrequency = exports.$Enums.ContributionFrequency = {
  WEEKLY: 'WEEKLY',
  BI_WEEKLY: 'BI_WEEKLY',
  MONTHLY: 'MONTHLY'
};

exports.MeetingFrequency = exports.$Enums.MeetingFrequency = {
  WEEKLY: 'WEEKLY',
  BI_WEEKLY: 'BI_WEEKLY',
  MONTHLY: 'MONTHLY'
};

exports.MembershipRole = exports.$Enums.MembershipRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

exports.MembershipStatus = exports.$Enums.MembershipStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  CONTRIBUTION: 'CONTRIBUTION',
  INTEREST: 'INTEREST',
  FEE: 'FEE',
  PENALTY: 'PENALTY',
  LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT: 'LOAN_REPAYMENT'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
  PENDING: 'PENDING',
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  EXCUSED: 'EXCUSED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  PAYMENT_DUE: 'PAYMENT_DUE',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  NEW_MEMBER: 'NEW_MEMBER',
  MEETING_REMINDER: 'MEETING_REMINDER',
  WITHDRAWAL_REQUEST: 'WITHDRAWAL_REQUEST',
  LOAN_REQUEST: 'LOAN_REQUEST',
  LOAN_APPROVED: 'LOAN_APPROVED',
  LOAN_REJECTED: 'LOAN_REJECTED',
  LOAN_REPAYMENT_DUE: 'LOAN_REPAYMENT_DUE',
  SYSTEM: 'SYSTEM'
};

exports.InvitationStatus = exports.$Enums.InvitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  EXPIRED: 'EXPIRED'
};

exports.GroupStatus = exports.$Enums.GroupStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

exports.LoanStatus = exports.$Enums.LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DISBURSED: 'DISBURSED',
  REPAYING: 'REPAYING',
  REPAID: 'REPAID',
  DEFAULTED: 'DEFAULTED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Group: 'Group',
  Membership: 'Membership',
  Transaction: 'Transaction',
  PersonalSavings: 'PersonalSavings',
  SavingsGoal: 'SavingsGoal',
  SavingsTransaction: 'SavingsTransaction',
  Meeting: 'Meeting',
  MeetingAttendee: 'MeetingAttendee',
  Vote: 'Vote',
  VoteResult: 'VoteResult',
  Notification: 'Notification',
  GroupInvitation: 'GroupInvitation',
  Wallet: 'Wallet',
  Contribution: 'Contribution',
  LoanRequest: 'LoanRequest',
  LoanVote: 'LoanVote'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\Projects\\Projects\\Projects\\pollen-ai\\lib\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "D:\\Projects\\Projects\\Projects\\pollen-ai\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "POSTGRES_PRISMA_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../lib/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"POSTGRES_PRISMA_URL\") // uses connection pooling\n  //directUrl = env(\"POSTGRES_URL_NON_POOLING\") // uses a direct connection\n}\n\nmodel User {\n  id                  String            @id @default(cuid())\n  name                String            @unique\n  email               String            @unique\n  phone               String?\n  clerkUserId         String?           @unique\n  password            String\n  avatar              String?\n  createdAt           DateTime          @default(now())\n  updatedAt           DateTime          @updatedAt\n  isAdmin             Boolean           @default(false)\n  memberships         Membership[]\n  ownedGroups         Group[]           @relation(\"GroupOwner\")\n  transactions        Transaction[]\n  personalSavings     PersonalSavings?\n  savingsGoals        SavingsGoal[]\n  notifications       Notification[]\n  sentInvitations     GroupInvitation[] @relation(\"SentInvitations\")\n  receivedInvitations GroupInvitation[] @relation(\"ReceivedInvitations\")\n  wallet              Wallet?\n  contributions       Contribution[]\n  loanRequests        LoanRequest[]     @relation(\"UserLoanRequests\")\n  loanVotes           LoanVote[]        @relation(\"UserLoanVotes\")\n}\n\nmodel Group {\n  id                    String                @id @default(cuid())\n  name                  String\n  description           String?\n  logo                  String?\n  groupCode             String?\n  createdAt             DateTime              @default(now())\n  updatedAt             DateTime              @updatedAt\n  ownerId               String\n  owner                 User                  @relation(\"GroupOwner\", fields: [ownerId], references: [id])\n  privacy               GroupPrivacy          @default(PRIVATE)\n  governanceType        GovernanceType        @default(ADMIN)\n  contributionAmount    Decimal               @default(0)\n  contributionFrequency ContributionFrequency @default(MONTHLY)\n  depositGoal           Decimal?\n  latePenaltyFee        Decimal               @default(0)\n  gracePeriod           Int                   @default(3) // Days\n  interestRate          Decimal               @default(0)\n  allowEarlyWithdrawal  Boolean               @default(false)\n  earlyWithdrawalFee    Decimal               @default(0)\n  requireApproval       Boolean               @default(true)\n  autoReminders         Boolean               @default(true)\n  votingThreshold       Int                   @default(50) // Percentage\n  allowLateJoining      Boolean               @default(true)\n  groupDuration         Int? // Duration in months\n  maxMembers            Int?\n  meetingFrequency      MeetingFrequency      @default(WEEKLY)\n  groupRules            String?               @db.Text\n  bylaws                String?               @db.Text\n  tags                  String?\n  status                GroupStatus           @default(ACTIVE)\n  memberships           Membership[]\n  transactions          Transaction[]\n  meetings              Meeting[]\n  invitations           GroupInvitation[]\n  contributions         Contribution[]\n  loanRequests          LoanRequest[]         @relation(\"GroupLoanRequests\")\n}\n\nmodel Membership {\n  id               String            @id @default(cuid())\n  userId           String\n  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  groupId          String\n  group            Group             @relation(fields: [groupId], references: [id], onDelete: Cascade)\n  role             MembershipRole    @default(MEMBER)\n  joinedAt         DateTime          @default(now())\n  status           MembershipStatus  @default(ACTIVE)\n  balance          Decimal           @default(0)\n  totalContributed Decimal           @default(0)\n  lastContribution DateTime?\n  votes            Vote[]\n  meetingAttendees MeetingAttendee[] // Added this relation\n  voteResults      VoteResult[] // Added this relation\n  loanVotes        LoanVote[]        @relation(\"MembershipLoanVotes\")\n\n  @@unique([userId, groupId])\n}\n\nmodel Transaction {\n  id            String            @id @default(cuid())\n  amount        Decimal\n  type          TransactionType\n  status        TransactionStatus @default(PENDING)\n  description   String?\n  createdAt     DateTime          @default(now())\n  updatedAt     DateTime          @updatedAt\n  userId        String\n  user          User              @relation(fields: [userId], references: [id])\n  groupId       String?\n  group         Group?            @relation(fields: [groupId], references: [id])\n  momoNumber    String?\n  reference     String?           @unique\n  feeAmount     Decimal?\n  walletId      String?\n  wallet        Wallet?           @relation(fields: [walletId], references: [id])\n  contribution  Contribution?\n  loanRequestId String?\n  loanRequest   LoanRequest?      @relation(fields: [loanRequestId], references: [id])\n}\n\nmodel PersonalSavings {\n  id        String   @id @default(cuid())\n  userId    String   @unique\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  balance   Decimal  @default(0)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel SavingsGoal {\n  id            String               @id @default(cuid())\n  name          String\n  targetAmount  Decimal\n  currentAmount Decimal              @default(0)\n  deadline      DateTime?\n  createdAt     DateTime             @default(now())\n  updatedAt     DateTime             @updatedAt\n  userId        String\n  user          User                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  isCompleted   Boolean              @default(false)\n  transactions  SavingsTransaction[]\n}\n\nmodel SavingsTransaction {\n  id            String   @id @default(cuid())\n  savingsGoalId String\n  amount        Float\n  type          String // 'DEPOSIT' or 'WITHDRAWAL'\n  description   String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  savingsGoal SavingsGoal @relation(fields: [savingsGoalId], references: [id], onDelete: Cascade)\n\n  @@index([savingsGoalId])\n}\n\nmodel Meeting {\n  id          String            @id @default(cuid())\n  title       String\n  description String?\n  date        DateTime\n  location    String?\n  isVirtual   Boolean           @default(false)\n  meetingLink String?\n  createdAt   DateTime          @default(now())\n  updatedAt   DateTime          @updatedAt\n  groupId     String\n  group       Group             @relation(fields: [groupId], references: [id], onDelete: Cascade)\n  attendees   MeetingAttendee[]\n}\n\nmodel MeetingAttendee {\n  id           String           @id @default(cuid())\n  meetingId    String\n  meeting      Meeting          @relation(fields: [meetingId], references: [id], onDelete: Cascade)\n  membershipId String\n  membership   Membership       @relation(fields: [membershipId], references: [id], onDelete: Cascade)\n  status       AttendanceStatus @default(PENDING)\n\n  @@unique([meetingId, membershipId])\n}\n\nmodel Vote {\n  id           String       @id @default(cuid())\n  title        String\n  description  String?\n  options      Json\n  startDate    DateTime\n  endDate      DateTime\n  createdAt    DateTime     @default(now())\n  updatedAt    DateTime     @updatedAt\n  membershipId String\n  membership   Membership   @relation(fields: [membershipId], references: [id], onDelete: Cascade)\n  voteResults  VoteResult[]\n}\n\nmodel VoteResult {\n  id             String     @id @default(cuid())\n  voteId         String\n  vote           Vote       @relation(fields: [voteId], references: [id], onDelete: Cascade)\n  membershipId   String\n  membership     Membership @relation(fields: [membershipId], references: [id], onDelete: Cascade)\n  selectedOption String\n  votedAt        DateTime   @default(now())\n\n  @@unique([voteId, membershipId])\n}\n\nmodel Notification {\n  id                   String           @id @default(cuid())\n  title                String\n  message              String\n  type                 NotificationType\n  isRead               Boolean          @default(false)\n  createdAt            DateTime         @default(now())\n  userId               String\n  user                 User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  relatedGroupId       String?\n  relatedTransactionId String?\n  relatedLoanRequestId String?\n}\n\nmodel GroupInvitation {\n  id        String           @id @default(cuid())\n  groupId   String\n  group     Group            @relation(fields: [groupId], references: [id], onDelete: Cascade)\n  inviterId String\n  inviter   User             @relation(\"SentInvitations\", fields: [inviterId], references: [id])\n  inviteeId String\n  invitee   User             @relation(\"ReceivedInvitations\", fields: [inviteeId], references: [id])\n  status    InvitationStatus @default(PENDING)\n  code      String           @unique\n  createdAt DateTime         @default(now())\n  expiresAt DateTime?\n}\n\nmodel Wallet {\n  id           String        @id @default(cuid())\n  userId       String        @unique\n  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  balance      Decimal       @default(0)\n  createdAt    DateTime      @default(now())\n  updatedAt    DateTime      @updatedAt\n  transactions Transaction[]\n}\n\nmodel Contribution {\n  id            String            @id @default(cuid())\n  amount        Decimal\n  status        TransactionStatus @default(PENDING)\n  createdAt     DateTime          @default(now())\n  updatedAt     DateTime          @updatedAt\n  userId        String\n  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  groupId       String\n  group         Group             @relation(fields: [groupId], references: [id], onDelete: Cascade)\n  transactionId String?           @unique\n  transaction   Transaction?      @relation(fields: [transactionId], references: [id])\n}\n\nmodel LoanRequest {\n  id             String        @id @default(cuid())\n  amount         Decimal\n  purpose        String        @db.Text\n  repaymentDate  DateTime\n  repaymentTerms String        @db.Text\n  installments   Int           @default(1)\n  interestRate   Decimal       @default(0)\n  status         LoanStatus    @default(PENDING)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n  userId         String\n  user           User          @relation(\"UserLoanRequests\", fields: [userId], references: [id], onDelete: Cascade)\n  groupId        String\n  group          Group         @relation(\"GroupLoanRequests\", fields: [groupId], references: [id], onDelete: Cascade)\n  transactions   Transaction[]\n  votes          LoanVote[]    @relation(\"LoanRequestVotes\")\n}\n\nmodel LoanVote {\n  id            String      @id @default(cuid())\n  vote          Boolean // true = approve, false = reject\n  comment       String?\n  createdAt     DateTime    @default(now())\n  updatedAt     DateTime    @updatedAt\n  userId        String\n  user          User        @relation(\"UserLoanVotes\", fields: [userId], references: [id], onDelete: Cascade)\n  loanRequestId String\n  loanRequest   LoanRequest @relation(\"LoanRequestVotes\", fields: [loanRequestId], references: [id], onDelete: Cascade)\n  membershipId  String\n  membership    Membership  @relation(\"MembershipLoanVotes\", fields: [membershipId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, loanRequestId])\n}\n\nenum GroupPrivacy {\n  PUBLIC\n  PRIVATE\n  INVITE_ONLY\n}\n\nenum GovernanceType {\n  ADMIN\n  MULTI_ADMIN\n  ONE_VOTE_PER_PERSON\n  ONE_VOTE_DEPOSIT\n}\n\nenum ContributionFrequency {\n  WEEKLY\n  BI_WEEKLY\n  MONTHLY\n}\n\nenum MeetingFrequency {\n  WEEKLY\n  BI_WEEKLY\n  MONTHLY\n}\n\nenum MembershipRole {\n  OWNER\n  ADMIN\n  MEMBER\n}\n\nenum MembershipStatus {\n  PENDING\n  ACTIVE\n  SUSPENDED\n  INACTIVE\n}\n\nenum TransactionType {\n  DEPOSIT\n  WITHDRAWAL\n  CONTRIBUTION\n  INTEREST\n  FEE\n  PENALTY\n  LOAN_DISBURSEMENT\n  LOAN_REPAYMENT\n}\n\nenum TransactionStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  CANCELLED\n}\n\nenum AttendanceStatus {\n  PENDING\n  PRESENT\n  ABSENT\n  EXCUSED\n}\n\nenum NotificationType {\n  PAYMENT_DUE\n  PAYMENT_RECEIVED\n  NEW_MEMBER\n  MEETING_REMINDER\n  WITHDRAWAL_REQUEST\n  LOAN_REQUEST\n  LOAN_APPROVED\n  LOAN_REJECTED\n  LOAN_REPAYMENT_DUE\n  SYSTEM\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  DECLINED\n  EXPIRED\n}\n\nenum GroupStatus {\n  ACTIVE\n  INACTIVE\n  COMPLETED\n  ARCHIVED\n}\n\nenum LoanStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  DISBURSED\n  REPAYING\n  REPAID\n  DEFAULTED\n}\n",
  "inlineSchemaHash": "d5bb24f5fabfb753d1e7c4c7bd285e68721a8e9cff32793afab0a0d37c134f3d",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clerkUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatar\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"isAdmin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memberships\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"nativeType\":null,\"relationName\":\"MembershipToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownedGroups\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"GroupOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"nativeType\":null,\"relationName\":\"TransactionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"personalSavings\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PersonalSavings\",\"nativeType\":null,\"relationName\":\"PersonalSavingsToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"savingsGoals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SavingsGoal\",\"nativeType\":null,\"relationName\":\"SavingsGoalToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Notification\",\"nativeType\":null,\"relationName\":\"NotificationToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentInvitations\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GroupInvitation\",\"nativeType\":null,\"relationName\":\"SentInvitations\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receivedInvitations\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GroupInvitation\",\"nativeType\":null,\"relationName\":\"ReceivedInvitations\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wallet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Wallet\",\"nativeType\":null,\"relationName\":\"UserToWallet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contributions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Contribution\",\"nativeType\":null,\"relationName\":\"ContributionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanRequests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanRequest\",\"nativeType\":null,\"relationName\":\"UserLoanRequests\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanVotes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanVote\",\"nativeType\":null,\"relationName\":\"UserLoanVotes\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Group\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"GroupOwner\",\"relationFromFields\":[\"ownerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"privacy\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"GroupPrivacy\",\"nativeType\":null,\"default\":\"PRIVATE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"governanceType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"GovernanceType\",\"nativeType\":null,\"default\":\"ADMIN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contributionAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contributionFrequency\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ContributionFrequency\",\"nativeType\":null,\"default\":\"MONTHLY\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositGoal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latePenaltyFee\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gracePeriod\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":3,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interestRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allowEarlyWithdrawal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"earlyWithdrawalFee\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requireApproval\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"autoReminders\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"votingThreshold\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":50,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allowLateJoining\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupDuration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxMembers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meetingFrequency\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MeetingFrequency\",\"nativeType\":null,\"default\":\"WEEKLY\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupRules\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bylaws\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"GroupStatus\",\"nativeType\":null,\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memberships\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"nativeType\":null,\"relationName\":\"GroupToMembership\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"nativeType\":null,\"relationName\":\"GroupToTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meetings\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Meeting\",\"nativeType\":null,\"relationName\":\"GroupToMeeting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invitations\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GroupInvitation\",\"nativeType\":null,\"relationName\":\"GroupToGroupInvitation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contributions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Contribution\",\"nativeType\":null,\"relationName\":\"ContributionToGroup\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanRequests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanRequest\",\"nativeType\":null,\"relationName\":\"GroupLoanRequests\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Membership\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"MembershipToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"GroupToMembership\",\"relationFromFields\":[\"groupId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MembershipRole\",\"nativeType\":null,\"default\":\"MEMBER\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MembershipStatus\",\"nativeType\":null,\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalContributed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastContribution\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"votes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Vote\",\"nativeType\":null,\"relationName\":\"MembershipToVote\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meetingAttendees\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MeetingAttendee\",\"nativeType\":null,\"relationName\":\"MeetingAttendeeToMembership\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voteResults\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoteResult\",\"nativeType\":null,\"relationName\":\"MembershipToVoteResult\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanVotes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanVote\",\"nativeType\":null,\"relationName\":\"MembershipLoanVotes\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"userId\",\"groupId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"groupId\"]}],\"isGenerated\":false},\"Transaction\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TransactionStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"TransactionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"GroupToTransaction\",\"relationFromFields\":[\"groupId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"momoNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"feeAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"walletId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wallet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Wallet\",\"nativeType\":null,\"relationName\":\"TransactionToWallet\",\"relationFromFields\":[\"walletId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contribution\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Contribution\",\"nativeType\":null,\"relationName\":\"ContributionToTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanRequestId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanRequest\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanRequest\",\"nativeType\":null,\"relationName\":\"LoanRequestToTransaction\",\"relationFromFields\":[\"loanRequestId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PersonalSavings\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"PersonalSavingsToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SavingsGoal\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"SavingsGoalToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isCompleted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SavingsTransaction\",\"nativeType\":null,\"relationName\":\"SavingsGoalToSavingsTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SavingsTransaction\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"savingsGoalId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"savingsGoal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SavingsGoal\",\"nativeType\":null,\"relationName\":\"SavingsGoalToSavingsTransaction\",\"relationFromFields\":[\"savingsGoalId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Meeting\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isVirtual\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meetingLink\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"groupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"GroupToMeeting\",\"relationFromFields\":[\"groupId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attendees\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MeetingAttendee\",\"nativeType\":null,\"relationName\":\"MeetingToMeetingAttendee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MeetingAttendee\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meetingId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meeting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Meeting\",\"nativeType\":null,\"relationName\":\"MeetingToMeetingAttendee\",\"relationFromFields\":[\"meetingId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membershipId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membership\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"nativeType\":null,\"relationName\":\"MeetingAttendeeToMembership\",\"relationFromFields\":[\"membershipId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AttendanceStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"meetingId\",\"membershipId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"meetingId\",\"membershipId\"]}],\"isGenerated\":false},\"Vote\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"options\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"membershipId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membership\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"nativeType\":null,\"relationName\":\"MembershipToVote\",\"relationFromFields\":[\"membershipId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voteResults\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoteResult\",\"nativeType\":null,\"relationName\":\"VoteToVoteResult\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VoteResult\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vote\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Vote\",\"nativeType\":null,\"relationName\":\"VoteToVoteResult\",\"relationFromFields\":[\"voteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membershipId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membership\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"nativeType\":null,\"relationName\":\"MembershipToVoteResult\",\"relationFromFields\":[\"membershipId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"selectedOption\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"votedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"voteId\",\"membershipId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"voteId\",\"membershipId\"]}],\"isGenerated\":false},\"Notification\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"NotificationType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isRead\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"NotificationToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relatedGroupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relatedTransactionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relatedLoanRequestId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"GroupInvitation\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"GroupToGroupInvitation\",\"relationFromFields\":[\"groupId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inviterId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inviter\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"SentInvitations\",\"relationFromFields\":[\"inviterId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inviteeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invitee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"ReceivedInvitations\",\"relationFromFields\":[\"inviteeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"InvitationStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Wallet\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserToWallet\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"nativeType\":null,\"relationName\":\"TransactionToWallet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Contribution\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TransactionStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"ContributionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"ContributionToGroup\",\"relationFromFields\":[\"groupId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transaction\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"nativeType\":null,\"relationName\":\"ContributionToTransaction\",\"relationFromFields\":[\"transactionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LoanRequest\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"repaymentDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"repaymentTerms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"installments\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interestRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"LoanStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserLoanRequests\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Group\",\"nativeType\":null,\"relationName\":\"GroupLoanRequests\",\"relationFromFields\":[\"groupId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"nativeType\":null,\"relationName\":\"LoanRequestToTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"votes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanVote\",\"nativeType\":null,\"relationName\":\"LoanRequestVotes\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LoanVote\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"comment\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserLoanVotes\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanRequestId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loanRequest\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoanRequest\",\"nativeType\":null,\"relationName\":\"LoanRequestVotes\",\"relationFromFields\":[\"loanRequestId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membershipId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membership\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"nativeType\":null,\"relationName\":\"MembershipLoanVotes\",\"relationFromFields\":[\"membershipId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"userId\",\"loanRequestId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"loanRequestId\"]}],\"isGenerated\":false}},\"enums\":{\"GroupPrivacy\":{\"values\":[{\"name\":\"PUBLIC\",\"dbName\":null},{\"name\":\"PRIVATE\",\"dbName\":null},{\"name\":\"INVITE_ONLY\",\"dbName\":null}],\"dbName\":null},\"GovernanceType\":{\"values\":[{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"MULTI_ADMIN\",\"dbName\":null},{\"name\":\"ONE_VOTE_PER_PERSON\",\"dbName\":null},{\"name\":\"ONE_VOTE_DEPOSIT\",\"dbName\":null}],\"dbName\":null},\"ContributionFrequency\":{\"values\":[{\"name\":\"WEEKLY\",\"dbName\":null},{\"name\":\"BI_WEEKLY\",\"dbName\":null},{\"name\":\"MONTHLY\",\"dbName\":null}],\"dbName\":null},\"MeetingFrequency\":{\"values\":[{\"name\":\"WEEKLY\",\"dbName\":null},{\"name\":\"BI_WEEKLY\",\"dbName\":null},{\"name\":\"MONTHLY\",\"dbName\":null}],\"dbName\":null},\"MembershipRole\":{\"values\":[{\"name\":\"OWNER\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"MEMBER\",\"dbName\":null}],\"dbName\":null},\"MembershipStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"SUSPENDED\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null}],\"dbName\":null},\"TransactionType\":{\"values\":[{\"name\":\"DEPOSIT\",\"dbName\":null},{\"name\":\"WITHDRAWAL\",\"dbName\":null},{\"name\":\"CONTRIBUTION\",\"dbName\":null},{\"name\":\"INTEREST\",\"dbName\":null},{\"name\":\"FEE\",\"dbName\":null},{\"name\":\"PENALTY\",\"dbName\":null},{\"name\":\"LOAN_DISBURSEMENT\",\"dbName\":null},{\"name\":\"LOAN_REPAYMENT\",\"dbName\":null}],\"dbName\":null},\"TransactionStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"AttendanceStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PRESENT\",\"dbName\":null},{\"name\":\"ABSENT\",\"dbName\":null},{\"name\":\"EXCUSED\",\"dbName\":null}],\"dbName\":null},\"NotificationType\":{\"values\":[{\"name\":\"PAYMENT_DUE\",\"dbName\":null},{\"name\":\"PAYMENT_RECEIVED\",\"dbName\":null},{\"name\":\"NEW_MEMBER\",\"dbName\":null},{\"name\":\"MEETING_REMINDER\",\"dbName\":null},{\"name\":\"WITHDRAWAL_REQUEST\",\"dbName\":null},{\"name\":\"LOAN_REQUEST\",\"dbName\":null},{\"name\":\"LOAN_APPROVED\",\"dbName\":null},{\"name\":\"LOAN_REJECTED\",\"dbName\":null},{\"name\":\"LOAN_REPAYMENT_DUE\",\"dbName\":null},{\"name\":\"SYSTEM\",\"dbName\":null}],\"dbName\":null},\"InvitationStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"ACCEPTED\",\"dbName\":null},{\"name\":\"DECLINED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null}],\"dbName\":null},\"GroupStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"ARCHIVED\",\"dbName\":null}],\"dbName\":null},\"LoanStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"APPROVED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"DISBURSED\",\"dbName\":null},{\"name\":\"REPAYING\",\"dbName\":null},{\"name\":\"REPAID\",\"dbName\":null},{\"name\":\"DEFAULTED\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    POSTGRES_PRISMA_URL: typeof globalThis !== 'undefined' && globalThis['POSTGRES_PRISMA_URL'] || typeof process !== 'undefined' && process.env && process.env.POSTGRES_PRISMA_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

