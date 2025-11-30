import { PrismaClient } from "../lib/generated/prisma"

const prisma = new PrismaClient()

const USER_ID = "cmim3wh7w0000s3liasex09hr"

const sampleGroups = [
  {
    name: "Weekend Savers Club",
    description: "A friendly group focused on building weekend savings habits. Perfect for those looking to save small amounts regularly.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=weekend",
    groupCode: "GRP-WKND01",
    privacy: "PUBLIC",
    governanceType: "ONE_VOTE_PER_PERSON",
    contributionAmount: 5000,
    contributionFrequency: "WEEKLY",
    depositGoal: 500000,
    latePenaltyFee: 500,
    gracePeriod: 3,
    interestRate: 2.5,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 1000,
    requireApproval: false,
    autoReminders: true,
    votingThreshold: 50,
    allowLateJoining: true,
    groupDuration: 12,
    maxMembers: 50,
    meetingFrequency: "WEEKLY",
    groupRules: "1. Weekly contributions must be made by Friday\n2. Respect all members\n3. Attend monthly meetings\n4. Use funds responsibly",
    bylaws: "Article 1: All members have equal voting rights\nArticle 2: Majority vote required for major decisions\nArticle 3: Treasurer elected annually",
    tags: "savings,weekly,community",
    status: "ACTIVE",
  },
  {
    name: "Professional Growth Fund",
    description: "For professionals looking to save towards career development, certifications, and business investments. Structured approach to wealth building.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=professional",
    groupCode: "GRP-PROF02",
    privacy: "PRIVATE",
    governanceType: "ADMIN",
    contributionAmount: 25000,
    contributionFrequency: "MONTHLY",
    depositGoal: 3000000,
    latePenaltyFee: 2500,
    gracePeriod: 5,
    interestRate: 5.0,
    allowEarlyWithdrawal: false,
    earlyWithdrawalFee: 5000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 60,
    allowLateJoining: false,
    groupDuration: 24,
    maxMembers: 30,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Monthly contributions by the 5th of each month\n2. Professional conduct required\n3. Mandatory attendance at quarterly reviews\n4. 6-month commitment minimum",
    bylaws: "Article 1: Admin has final decision-making authority\nArticle 2: Withdrawal requests require 30-day notice\nArticle 3: Interest distributed annually",
    tags: "professional,career,investment",
    status: "ACTIVE",
  },
  {
    name: "University Students Savings Circle",
    description: "Exclusive group for university students learning financial discipline. Small contributions, big impact!",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=students",
    groupCode: "GRP-STUD03",
    privacy: "INVITE_ONLY",
    governanceType: "MULTI_ADMIN",
    contributionAmount: 3000,
    contributionFrequency: "BI_WEEKLY",
    depositGoal: 200000,
    latePenaltyFee: 300,
    gracePeriod: 7,
    interestRate: 1.5,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 500,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 50,
    allowLateJoining: true,
    groupDuration: 9,
    maxMembers: 25,
    meetingFrequency: "BI_WEEKLY",
    groupRules: "1. Valid student ID required\n2. Bi-weekly contributions\n3. Help fellow students when possible\n4. No withdrawal during exam periods",
    bylaws: "Article 1: Committee of 5 elected students\nArticle 2: Decisions by committee vote\nArticle 3: Academic standing maintained",
    tags: "students,university,learning",
    status: "ACTIVE",
  },
  {
    name: "Family Emergency Fund",
    description: "Building a safety net together. This group focuses on creating emergency funds for unexpected family expenses.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=family",
    groupCode: "GRP-FAM04",
    privacy: "PUBLIC",
    governanceType: "ADMIN",
    contributionAmount: 15000,
    contributionFrequency: "MONTHLY",
    depositGoal: 1500000,
    latePenaltyFee: 1500,
    gracePeriod: 5,
    interestRate: 3.0,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 2000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 70,
    allowLateJoining: true,
    groupDuration: 18,
    maxMembers: 40,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Contributions by the 1st of each month\n2. Emergency withdrawals allowed with approval\n3. Support members in crisis\n4. Confidentiality maintained",
    bylaws: "Article 1: Emergency requests prioritized\nArticle 2: Admin approves emergency withdrawals\nArticle 3: Group supports members in need",
    tags: "family,emergency,support",
    status: "ACTIVE",
  },
  {
    name: "Entrepreneur Investment Pool",
    description: "Ambitious entrepreneurs pooling resources for business ventures and startup investments. High risk, high reward!",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=entrepreneur",
    groupCode: "GRP-ENT05",
    privacy: "PRIVATE",
    governanceType: "ONE_VOTE_PER_PERSON",
    contributionAmount: 50000,
    contributionFrequency: "MONTHLY",
    depositGoal: 5000000,
    latePenaltyFee: 5000,
    gracePeriod: 3,
    interestRate: 7.5,
    allowEarlyWithdrawal: false,
    earlyWithdrawalFee: 10000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 75,
    allowLateJoining: false,
    groupDuration: 36,
    maxMembers: 20,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Monthly contributions mandatory\n2. Investment decisions by group vote\n3. Attend all investment meetings\n4. 3-year minimum commitment",
    bylaws: "Article 1: All members vote on investments\n Article 2: 75% majority for major decisions\nArticle 3: Profit sharing based on contributions",
    tags: "entrepreneur,investment,business",
    status: "ACTIVE",
  },
  {
    name: "Women Empowerment Savings",
    description: "Supporting women's financial independence and business growth. A safe space for women to achieve their financial goals.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=women",
    groupCode: "GRP-WOM06",
    privacy: "PUBLIC",
    governanceType: "MULTI_ADMIN",
    contributionAmount: 10000,
    contributionFrequency: "MONTHLY",
    depositGoal: 1000000,
    latePenaltyFee: 1000,
    gracePeriod: 5,
    interestRate: 4.0,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 1500,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 60,
    allowLateJoining: true,
    groupDuration: 24,
    maxMembers: 60,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Open to all women\n2. Support and mentor each other\n3. Monthly financial literacy sessions\n4. Respect and confidentiality",
    bylaws: "Article 1: Committee of 7 elected members\nArticle 2: Focus on women's empowerment\nArticle 3: Business loan support available",
    tags: "women,empowerment,community",
    status: "ACTIVE",
  },
  {
    name: "Youth Dream Builders",
    description: "Young people saving for their dreams - education, travel, first car, or starting a business. Let's build the future together!",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=youth",
    groupCode: "GRP-YTH07",
    privacy: "PUBLIC",
    governanceType: "ONE_VOTE_PER_PERSON",
    contributionAmount: 7500,
    contributionFrequency: "WEEKLY",
    depositGoal: 750000,
    latePenaltyFee: 750,
    gracePeriod: 7,
    interestRate: 3.5,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 1000,
    requireApproval: false,
    autoReminders: true,
    votingThreshold: 50,
    allowLateJoining: true,
    groupDuration: 12,
    maxMembers: 100,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Weekly contributions\n2. Age 18-30 years\n3. Participate in group activities\n4. Support fellow youth",
    bylaws: "Article 1: Democratic decision making\nArticle 2: Youth leadership development\nArticle 3: Mentorship programs included",
    tags: "youth,dreams,future",
    status: "ACTIVE",
  },
  {
    name: "Housing & Property Fund",
    description: "Long-term savings group for those planning to buy property or invest in real estate. Steady contributions for big dreams!",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=housing",
    groupCode: "GRP-HOU08",
    privacy: "PRIVATE",
    governanceType: "ADMIN",
    contributionAmount: 100000,
    contributionFrequency: "MONTHLY",
    depositGoal: 10000000,
    latePenaltyFee: 10000,
    gracePeriod: 3,
    interestRate: 6.0,
    allowEarlyWithdrawal: false,
    earlyWithdrawalFee: 20000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 80,
    allowLateJoining: false,
    groupDuration: 60,
    maxMembers: 15,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Monthly contributions of ZMW 100,000\n2. 5-year commitment required\n3. Property investment focus\n4. Monthly property seminars",
    bylaws: "Article 1: Admin manages investments\nArticle 2: Real estate focus only\nArticle 3: Exit allowed after 2 years with penalty",
    tags: "housing,property,real-estate",
    status: "ACTIVE",
  },
  {
    name: "Retirement Planning Group",
    description: "Never too early to plan for retirement! Join us in building a secure financial future for your golden years.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=retirement",
    groupCode: "GRP-RET09",
    privacy: "PUBLIC",
    governanceType: "MULTI_ADMIN",
    contributionAmount: 30000,
    contributionFrequency: "MONTHLY",
    depositGoal: 5000000,
    latePenaltyFee: 3000,
    gracePeriod: 5,
    interestRate: 5.5,
    allowEarlyWithdrawal: false,
    earlyWithdrawalFee: 15000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 65,
    allowLateJoining: true,
    groupDuration: 120,
    maxMembers: 35,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Monthly contributions mandatory\n2. Long-term commitment (10 years)\n3. Retirement planning workshops\n4. Investment in stable funds",
    bylaws: "Article 1: Committee of 5 financial advisors\nArticle 2: Conservative investment strategy\nArticle 3: Withdrawal at retirement age or emergency",
    tags: "retirement,planning,future",
    status: "ACTIVE",
  },
  {
    name: "Tech Innovators Fund",
    description: "For tech enthusiasts saving to invest in technology, gadgets, courses, and tech startups. Innovation meets savings!",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=tech",
    groupCode: "GRP-TCH10",
    privacy: "INVITE_ONLY",
    governanceType: "ONE_VOTE_PER_PERSON",
    contributionAmount: 20000,
    contributionFrequency: "MONTHLY",
    depositGoal: 2000000,
    latePenaltyFee: 2000,
    gracePeriod: 5,
    interestRate: 4.5,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 3000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 60,
    allowLateJoining: false,
    groupDuration: 24,
    maxMembers: 25,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Tech industry professionals only\n2. Monthly tech meetups\n3. Investment in tech opportunities\n4. Knowledge sharing encouraged",
    bylaws: "Article 1: Democratic tech investment decisions\nArticle 2: Priority for tech education funding\nArticle 3: Innovation encouraged",
    tags: "tech,innovation,digital",
    status: "ACTIVE",
  },
  {
    name: "Community Health Fund",
    description: "Building a health safety net for our community. Save together for medical emergencies and health insurance.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=health",
    groupCode: "GRP-HLT11",
    privacy: "PUBLIC",
    governanceType: "MULTI_ADMIN",
    contributionAmount: 12000,
    contributionFrequency: "MONTHLY",
    depositGoal: 1200000,
    latePenaltyFee: 1200,
    gracePeriod: 7,
    interestRate: 2.0,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 1000,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 50,
    allowLateJoining: true,
    groupDuration: 12,
    maxMembers: 80,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Health-focused contributions\n2. Emergency medical support\n3. Health education sessions\n4. Support members in medical crisis",
    bylaws: "Article 1: Committee includes health professionals\nArticle 2: Fast-track medical emergency withdrawals\nArticle 3: Health insurance group rates",
    tags: "health,medical,community",
    status: "ACTIVE",
  },
  {
    name: "Education Excellence Fund",
    description: "Investing in education - school fees, courses, books, and learning materials. Education is the key to success!",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=education",
    groupCode: "GRP-EDU12",
    privacy: "PUBLIC",
    governanceType: "ADMIN",
    contributionAmount: 18000,
    contributionFrequency: "MONTHLY",
    depositGoal: 2000000,
    latePenaltyFee: 1800,
    gracePeriod: 5,
    interestRate: 3.0,
    allowEarlyWithdrawal: true,
    earlyWithdrawalFee: 2500,
    requireApproval: true,
    autoReminders: true,
    votingThreshold: 55,
    allowLateJoining: true,
    groupDuration: 36,
    maxMembers: 50,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Education-focused savings\n2. School fee assistance available\n3. Scholarship fund contributions\n4. Academic progress encouraged",
    bylaws: "Article 1: Education is priority\nArticle 2: Support for children's education\nArticle 3: Scholarship committee established",
    tags: "education,learning,school",
    status: "ACTIVE",
  },
  {
    name: "Small Business Boost",
    description: "Archived group for reference. Was focused on helping small business owners grow their ventures through collective savings.",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=business",
    groupCode: "GRP-BUS13",
    privacy: "PRIVATE",
    governanceType: "ADMIN",
    contributionAmount: 35000,
    contributionFrequency: "MONTHLY",
    depositGoal: 3500000,
    latePenaltyFee: 3500,
    gracePeriod: 3,
    interestRate: 6.5,
    allowEarlyWithdrawal: false,
    earlyWithdrawalFee: 7000,
    requireApproval: true,
    autoReminders: false,
    votingThreshold: 70,
    allowLateJoining: false,
    groupDuration: 24,
    maxMembers: 20,
    meetingFrequency: "MONTHLY",
    groupRules: "1. Business owners only\n2. Business plan required\n3. Mentorship provided\n4. Loan applications considered",
    bylaws: "Article 1: Business growth focus\nArticle 2: Peer mentorship program\nArticle 3: Loan committee reviews applications",
    tags: "business,entrepreneur,archived",
    status: "INACTIVE",
  },
]

async function main() {
  console.log("🌱 Starting seed process for sample groups...")

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: USER_ID },
    })

    if (!user) {
      console.error(`❌ User with ID ${USER_ID} not found. Please ensure the user exists in the database.`)
      process.exit(1)
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`)

    // Delete existing sample groups (optional - comment out if you want to keep existing data)
    console.log("\n🗑️  Cleaning up existing sample groups...")
    const deletedMemberships = await prisma.membership.deleteMany({
      where: {
        group: {
          groupCode: {
            startsWith: "GRP-",
          },
        },
      },
    })
    console.log(`   Deleted ${deletedMemberships.count} memberships`)

    const deletedGroups = await prisma.group.deleteMany({
      where: {
        groupCode: {
          startsWith: "GRP-",
        },
      },
    })
    console.log(`   Deleted ${deletedGroups.count} groups`)

    // Create new groups
    console.log("\n📦 Creating sample groups...")
    let createdCount = 0

    for (const groupData of sampleGroups) {
      try {
        const group = await prisma.group.create({
          data: {
            ...groupData,
            ownerId: USER_ID,
          },
        })

        // Create membership for the owner
        await prisma.membership.create({
          data: {
            userId: USER_ID,
            groupId: group.id,
            role: "OWNER",
            status: "ACTIVE",
            balance: 0,
            totalContributed: 0,
          },
        })

        createdCount++
        console.log(`   ✅ Created: ${group.name}`)
      } catch (error) {
        console.error(`   ❌ Failed to create group: ${groupData.name}`)
        console.error(`      Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    console.log(`\n🎉 Successfully created ${createdCount} groups!`)
    console.log(`\n📊 Summary:`)
    console.log(`   - Total groups: ${createdCount}`)
    console.log(`   - PUBLIC: ${sampleGroups.filter((g) => g.privacy === "PUBLIC").length}`)
    console.log(`   - PRIVATE: ${sampleGroups.filter((g) => g.privacy === "PRIVATE").length}`)
    console.log(`   - INVITE_ONLY: ${sampleGroups.filter((g) => g.privacy === "INVITE_ONLY").length}`)
    console.log(`   - ACTIVE: ${sampleGroups.filter((g) => g.status === "ACTIVE").length}`)
    console.log(`   - INACTIVE: ${sampleGroups.filter((g) => g.status === "INACTIVE").length}`)
  } catch (error) {
    console.error("\n❌ Error during seed process:")
    console.error(error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

