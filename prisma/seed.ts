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

