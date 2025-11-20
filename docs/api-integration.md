# API Integration for Groups and Loan Requests

This document explains how the application fetches groups from the API and allows users to request loans in selected groups.

## Database Schema

The application uses Prisma as an ORM with the following models for groups and loans:

### Group Model

```prisma
model Group {
  id                  String            @id @default(cuid())
  name                String
  description         String?
  logo                String?
  groupCode           String?
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  ownerId             String
  owner               User              @relation("GroupOwner", fields: [ownerId], references: [id])
  privacy             GroupPrivacy      @default(PRIVATE)
  governanceType      GovernanceType    @default(ADMIN)
  contributionAmount  Decimal           @default(0)
  contributionFrequency ContributionFrequency @default(MONTHLY)
  depositGoal         Decimal?
  latePenaltyFee      Decimal           @default(0)
  gracePeriod         Int               @default(3) // Days
  interestRate        Decimal           @default(0)
  allowEarlyWithdrawal Boolean          @default(false)
  earlyWithdrawalFee  Decimal           @default(0)
  requireApproval     Boolean           @default(true)
  autoReminders       Boolean           @default(true)
  votingThreshold     Int               @default(50) // Percentage
  allowLateJoining    Boolean           @default(true)
  groupDuration       Int?              // Duration in months
  maxMembers          Int?
  meetingFrequency    MeetingFrequency  @default(WEEKLY)
  groupRules          String?           @db.Text
  bylaws              String?           @db.Text
  tags                String?
  status              GroupStatus       @default(ACTIVE)
  memberships         Membership[]
  transactions        Transaction[]
  meetings            Meeting[]
  invitations         GroupInvitation[]
  contributions       Contribution[]
}
```

### Membership Model

```prisma
model Membership {
  id                String            @id @default(cuid())
  userId            String
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  groupId           String
  group             Group             @relation(fields: [groupId], references: [id], onDelete: Cascade)
  role              MembershipRole    @default(MEMBER)
  joinedAt          DateTime          @default(now())
  status            MembershipStatus  @default(ACTIVE)
  balance           Decimal           @default(0)
  totalContributed  Decimal           @default(0)
  lastContribution  DateTime?
  votes             Vote[]
  meetingAttendees  MeetingAttendee[]
  voteResults       VoteResult[]

  @@unique([userId, groupId])
}
```

## API Endpoints

### GET /api/groups

This endpoint fetches all groups that the authenticated user is a member of.

```typescript
export async function GET(req: Request) {
  const prisma = new PrismaClient()
  
  try {
   const session = await auth()

   if(!session || !session.userId === null){
    return NextResponse.json({error:"Not Authorized"},{status:401})
   }
    
    try {
      const groups = await prisma.group.findMany({
        where: {
          memberships: {
            some: {
              user: {
                clerkUserId: session?.userId
              }
            }
          }
        },
        include: {
          memberships: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      });
      
      return NextResponse.json(groups);
    } catch (prismaError) {
      return NextResponse.json(
        { error: "Database error fetching groups" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
```

## Frontend Integration

### GroupMembers Component

The GroupMembers component fetches groups from the API and displays them in a dropdown. It also provides a "Request Loan" button that navigates to the loan request form with the selected group ID.

```typescript
// Fetch groups from API
useEffect(() => {
  const fetchGroups = async () => {
    setIsLoadingGroups(true)
    setGroupsError("")
    
    try {
      const response = await fetch('/api/groups')
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      
      const data = await response.json()
      
      // Add the "All Groups" option and map the API response to the format we need
      setGroups([
        { id: "all", name: "All Groups" },
        ...data.map((group: any) => ({
          id: group.id,
          name: group.name
        }))
      ])
    } catch (error) {
      console.error('Error fetching groups:', error)
      setGroupsError("Failed to load groups. Please try again.")
      // Fallback to mock data if API fails
      setGroups([
        { id: "all", name: "All Groups" },
        { id: "group1", name: "Savings Group A" },
        { id: "group2", name: "Investment Club B" },
        { id: "group3", name: "Community Cooperative" },
      ])
    } finally {
      setIsLoadingGroups(false)
    }
  }
  
  fetchGroups()
}, [])
```

### LoanRequestForm Component

The LoanRequestForm component fetches groups from the API and allows users to select a group for their loan request. It also accepts a `preSelectedGroupId` prop that pre-selects a group when navigating from the GroupMembers component.

```typescript
// Fetch groups from API
useEffect(() => {
  const fetchGroups = async () => {
    setIsLoadingGroups(true)
    setGroupsError("")
    
    try {
      const response = await fetch('/api/groups')
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      
      const data = await response.json()
      
      // Map the API response to the format we need
      const formattedGroups = data.map((group: any) => ({
        id: group.id,
        name: group.name,
        maxLoanAmount: group.depositGoal || 2000,
        memberCount: group.memberships?.length || 0,
        availableFunds: 5000,
        interestRate: parseFloat(group.interestRate) || 3,
      }))
      
      setMyGroups(formattedGroups)
    } catch (error) {
      console.error('Error fetching groups:', error)
      setGroupsError("Failed to load groups. Please try again.")
      // Fallback to mock data if API fails
      setMyGroups([
        // Mock data...
      ])
    } finally {
      setIsLoadingGroups(false)
    }
  }
  
  fetchGroups()
}, [])
```

## Requesting a Loan in a Selected Group

To request a loan in a selected group, the user can:

1. Navigate to the GroupMembers component
2. Select a group from the dropdown
3. Click the "Request Loan" button
4. The application will navigate to the loan request form with the selected group ID as a query parameter
5. The LoanRequestForm component will pre-select the group based on the query parameter

This flow allows users to quickly request loans in specific groups without having to manually select the group in the loan request form.