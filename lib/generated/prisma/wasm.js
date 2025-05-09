
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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

exports.GroupStatus = exports.$Enums.GroupStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
