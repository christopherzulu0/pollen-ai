import { prisma } from '@/lib/prisma'
import 'dotenv/config'

async function main() {
  console.log("🌱 Seeding insurance products and policies...")

  // Create Insurance Products
  const products = [
    {
      name: "Crop Insurance",
      productType: "crop",
      description: "Protect your harvest from weather damage, pests, and crop failure",
      coverageAmount: 5000,
      premiumAmount: 50,
      premiumFrequency: "seasonal",
      features: ["Drought protection", "Pest damage", "Flood coverage", "Seasonal payment"],
      requirements: ["Valid farming license", "Land ownership proof"],
      status: "active",
      claimProcessingTime: "7-14 days",
      maxClaimAmount: 5000,
      deductible: 100,
    },
    {
      name: "Health Emergency",
      productType: "health",
      description: "Emergency medical coverage for unexpected health incidents",
      coverageAmount: 10000,
      premiumAmount: 15,
      premiumFrequency: "monthly",
      features: ["Hospital admission", "Emergency surgery", "Ambulance service", "24/7 support"],
      requirements: ["Valid ID", "Medical history"],
      status: "active",
      claimProcessingTime: "3-7 days",
      maxClaimAmount: 10000,
      deductible: 50,
    },
    {
      name: "Loan Protection",
      productType: "loan_protection",
      description: "Coverage for loan repayment in case of death or disability",
      coverageAmount: 20000,
      premiumAmount: 8,
      premiumFrequency: "monthly",
      features: ["Death benefit", "Disability coverage", "Automatic repayment", "Family protection"],
      requirements: ["Active loan", "Medical certificate"],
      status: "active",
      claimProcessingTime: "14-21 days",
      maxClaimAmount: 20000,
      deductible: 0,
    },
    {
      name: "Group Savings Fraud",
      productType: "savings_fraud",
      description: "Protection against fraud and theft in group savings accounts",
      coverageAmount: 15000,
      premiumAmount: 5,
      premiumFrequency: "monthly",
      features: ["Fraud detection", "Full reimbursement", "Legal support", "Account monitoring"],
      requirements: ["Group membership", "Savings account"],
      status: "active",
      claimProcessingTime: "5-10 days",
      maxClaimAmount: 15000,
      deductible: 0,
    },
    {
      name: "Mobile Phone",
      productType: "mobile",
      description: "Coverage for mobile phone damage, theft, and loss",
      coverageAmount: 1000,
      premiumAmount: 10,
      premiumFrequency: "monthly",
      features: ["Theft protection", "Accidental damage", "Screen replacement", "Water damage"],
      requirements: ["Phone purchase receipt", "IMEI number"],
      status: "active",
      claimProcessingTime: "3-5 days",
      maxClaimAmount: 1000,
      deductible: 25,
    },
    {
      name: "Weather Parametric",
      productType: "weather",
      description: "Automatic payouts based on weather data triggers",
      coverageAmount: 8000,
      premiumAmount: 20,
      premiumFrequency: "seasonal",
      features: ["Automatic triggers", "No claim filing", "Weather data based", "Fast payouts"],
      requirements: ["Farming license", "Location verification"],
      status: "active",
      claimProcessingTime: "Automatic",
      maxClaimAmount: 8000,
      deductible: 0,
    },
  ]

  // Create or update products
  const createdProducts = []
  for (const productData of products) {
    // Check if product exists by name and productType
    const existingProduct = await prisma.insuranceProduct.findFirst({
      where: {
        name: productData.name,
        productType: productData.productType,
      },
    })

    let product
    if (existingProduct) {
      // Update existing product
      product = await prisma.insuranceProduct.update({
        where: {
          id: existingProduct.id,
        },
        data: productData,
      })
      console.log(`✅ Updated product: ${product.name}`)
    } else {
      // Create new product
      product = await prisma.insuranceProduct.create({
        data: productData,
      })
      console.log(`✅ Created product: ${product.name}`)
    }
    createdProducts.push(product)
  }

  // Get a sample user to create policies for (you can modify this to use a specific user)
  const sampleUser = await prisma.user.findFirst({
    where: {
      email: {
        contains: "@",
      },
    },
  })

  if (!sampleUser) {
    console.log("⚠️  No user found. Please create a user first.")
    return
  }

  console.log(`📋 Creating policies for user: ${sampleUser.email}`)

  // Create sample policies
  const policies = [
    {
      policyNumber: "CRP-2024-001",
      productId: createdProducts.find((p) => p.productType === "crop")?.id || createdProducts[0].id,
      userId: sampleUser.id,
      coverageAmount: 5000,
      premiumAmount: 50,
      premiumFrequency: "seasonal",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-12-15"),
      renewalDate: new Date("2024-12-15"),
      status: "active",
      paymentStatus: "paid",
      lastPremiumPaid: new Date("2024-01-15"),
      nextPremiumDue: new Date("2024-06-15"),
      beneficiaries: [],
      documents: [],
    },
    {
      policyNumber: "HLT-2024-002",
      productId: createdProducts.find((p) => p.productType === "health")?.id || createdProducts[1].id,
      userId: sampleUser.id,
      coverageAmount: 10000,
      premiumAmount: 15,
      premiumFrequency: "monthly",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2025-02-01"),
      renewalDate: new Date("2025-02-01"),
      status: "active",
      paymentStatus: "paid",
      lastPremiumPaid: new Date("2024-04-01"),
      nextPremiumDue: new Date("2024-05-01"),
      beneficiaries: [],
      documents: [],
    },
    {
      policyNumber: "MOB-2024-003",
      productId: createdProducts.find((p) => p.productType === "mobile")?.id || createdProducts[4].id,
      userId: sampleUser.id,
      coverageAmount: 1000,
      premiumAmount: 10,
      premiumFrequency: "monthly",
      startDate: new Date("2024-03-10"),
      endDate: new Date("2025-03-10"),
      renewalDate: new Date("2025-03-10"),
      status: "active",
      paymentStatus: "paid",
      lastPremiumPaid: new Date("2024-03-10"),
      nextPremiumDue: new Date("2024-04-25"),
      beneficiaries: [],
      documents: [],
    },
  ]

  // Create or update policies
  for (const policyData of policies) {
    const policy = await prisma.insurancePolicy.upsert({
      where: {
        policyNumber: policyData.policyNumber,
      },
      update: policyData,
      create: policyData,
    })
    console.log(`✅ Created/Updated policy: ${policy.policyNumber}`)
  }

  console.log("✨ Insurance seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding insurance:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

