export interface GroupWithDetails {
  id: string
  name: string
  description: string | null
  logo: string | null
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY"
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "ARCHIVED"
  contributionAmount: number
  contributionFrequency: "WEEKLY" | "BI_WEEKLY" | "MONTHLY"
  depositGoal: number | null
  interestRate: number
  maxMembers: number | null
  memberCount: number
  requireApproval: boolean
  createdAt: Date
  adminName?: string
  adminEmail?: string
  adminPhone?: string
  groupRules?: string
  bylaws?: string
  // User membership information
  userMembershipId?: string | null
  userMembershipRole?: string | null
  userMembershipStatus?: "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE" | null
  isUserMember?: boolean
}
