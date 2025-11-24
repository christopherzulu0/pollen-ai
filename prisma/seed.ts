import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Blog Categories
  const blogCategories = [
    {
      name: 'Technology',
      description: 'Latest technology trends, innovations, and digital solutions',
    },
    {
      name: 'Climate Finance',
      description: 'Financial solutions and strategies for climate change and sustainability',
    },
    {
      name: 'Blockchain',
      description: 'Blockchain technology, cryptocurrencies, and decentralized finance',
    },
    {
      name: 'Financial Inclusion',
      description: 'Strategies and initiatives for expanding access to financial services',
    },
    {
      name: 'Agriculture',
      description: 'Agricultural innovations, farming solutions, and rural development',
    },
    {
      name: 'Innovation',
      description: 'Cutting-edge innovations and breakthrough technologies',
    },
    {
      name: 'Sustainability',
      description: 'Sustainable practices, environmental impact, and green solutions',
    },
    {
      name: 'Business',
      description: 'Business strategies, entrepreneurship, and market insights',
    },
    {
      name: 'AI & Machine Learning',
      description: 'Artificial intelligence, machine learning, and data science applications',
    },
    {
      name: 'Mobile Money',
      description: 'Mobile payment solutions and digital wallet innovations',
    },
  ]

  console.log('📝 Seeding BlogCategories...')

  for (const category of blogCategories) {
    // Note: The current schema has a relation issue where BlogCategory
    // uses its own ID as a foreign key to BlogPost. This seed creates
    // categories but they won't be properly linked to posts until the
    // schema is fixed to use a blog_post_id field.

    const existing = await prisma.blogCategory.findFirst({
      where: { name: category.name },
    })

    if (!existing) {
      await prisma.blogCategory.create({
        data: category,
      })
      console.log(`✅ Created category: ${category.name}`)
    } else {
      console.log(`⏭️  Category already exists: ${category.name}`)
    }
  }

  // Services
  const services = [
    {
      id: "cmid57msv0001l504q3jl8n7u",
      name: "Solar Equipment ",
      nameKey: "Irrigation Loans)",
      description: "Asset financing specifically for climate-smart agriculture. We offer loans for solar-powered irrigation systems and other productive assets, enabling smallholder farmers to farm year-round, increase yields, and build resilience against climate shocks. Repayments are aligned with harvest cycles, making high-value equipment accessible and affordable.",
      category: "Irrigation Loans",
      status: "active",
      icon: "Zap",
      image: "https://utfs.io/f/Z8mqjWl5RPlIg9eompfEyuSsJ1Kj9kgEQhO5iMmHCxUDtcN0",
      users: 5,
      revenue: 540,
      growth: 10,
      keyFeatures: [
        "Asset Financing Workflow",
        "Flexible Repayment Schedules",
        "Partnership Integration",
        "Farmer Profile Management",
        "Insurance Integration"
      ],
      requirements: [
        "Valid National ID",
        "Farmer or Agribusiness Verification",
        "Income or Yield Activity Evidence",
        "Consent to seasonal repayment schedule"
      ],
      created_at: "2025-11-24T12:48:26.668Z",
      updated_at: "2025-11-24T12:50:02.465Z"
    },
    {
      id: "cmid53cyh0000l504ga9wi0yl",
      name: "Village Banking Loans",
      nameKey: "Group Loans for VSLAs/Cooperatives",
      description: "Group-based lending solutions tailored for savings groups (VSLAs) and cooperatives. This service digitizes traditional village banking, allowing groups to pool savings securely and access larger, external credit lines based on their collective repayment performance. It enhances transparency, reduces cash-handling risks, and empowers women and youth groups to invest in income-generating activities.",
      category: "Village Banking",
      status: "active",
      icon: "UsersRound",
      image: "https://utfs.io/f/Z8mqjWl5RPlIWredYpQXiwSMvxNkam9J523IYnsbVogPRKUu",
      users: 5,
      revenue: 100,
      growth: 1,
      keyFeatures: [
        "Registered Savings Group / Cooperative",
        "Minimum Group Age: 3–6 months of savings activity",
        "Active Leadership Team: Chairperson, Secretary, Treasurer",
        "Minimum Number of Members: (Usually 10–30)",
        "Group Constitution or Bylaws",
        "Savings Contribution History"
      ],
      requirements: [
        "Valid National ID",
        "Mobile money number",
        "Participation in group meetings",
        "Agree to group-backed liability and repayment rules",
        "Consent to data verification"
      ],
      created_at: "2025-11-24T12:45:07.285Z",
      updated_at: "2025-11-24T12:45:07.285Z"
    },
    {
      id: "cmid4kvjx0000l404h9uxxfgz",
      name: "Personal Loans ",
      nameKey: "Digital Loans",
      description: "Instant, collateral-free microloans designed for individuals with irregular income streams. Using AI-driven credit scoring based on transaction history and savings behavior, we provide quick access to working capital for emergencies, school fees, or small business inventory, helping users build a formal credit profile over time.",
      category: "Digital Loans",
      status: "active",
      icon: "Bitcoin",
      image: "https://utfs.io/f/Z8mqjWl5RPlI4uo68WqIrN7RglS8Dzu2vPjH3WUXKZakETcp",
      users: 100,
      revenue: 5000,
      growth: 100,
      keyFeatures: [
        "AI Credit Scoring",
        "Instant Loan Processing",
        "Flexible Repayment",
        "User Onboarding & Verification",
        "Loan Management Dashboard"
      ],
      requirements: [
        "Valid National ID",
        "Consent to AI Credit Scoring & Data Processing",
        "Recent payslip or business trading evidence",
        "Bank statement"
      ],
      created_at: "2025-11-24T12:30:44.922Z",
      updated_at: "2025-11-24T12:32:52.736Z"
    }
  ]

  console.log('📝 Seeding Services...')

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        ...service,
        created_at: new Date(service.created_at),
        updated_at: new Date(service.updated_at)
      },
      create: {
        ...service,
        created_at: new Date(service.created_at),
        updated_at: new Date(service.updated_at)
      },
    })
    console.log(`✅ Upserted service: ${service.name}`)
  }

  console.log('✨ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

