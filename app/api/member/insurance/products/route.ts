import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch available insurance products for members
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch active insurance products
    const products = await prisma.insuranceProduct.findMany({
      where: {
        status: "active",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Icon mapping based on product type
    const iconMap: Record<string, string> = {
      crop: "Sprout",
      health: "Heart",
      loan_protection: "Shield",
      savings_fraud: "Users",
      mobile: "Smartphone",
      weather: "Cloud",
    }

    // Transform products to match component's expected format
    const transformedProducts = products.map((product) => ({
      id: product.id,
      productType: product.productType,
      name: product.name,
      description: product.description,
      premium: `ZMW ${parseFloat(product.premiumAmount.toString()).toLocaleString()}/${product.premiumFrequency === "seasonal" ? "season" : product.premiumFrequency === "monthly" ? "month" : "year"}`,
      coverage: `ZMW ${parseFloat(product.coverageAmount.toString()).toLocaleString()}`,
      features: product.features || [],
      requirements: product.requirements || [],
      claimProcessingTime: product.claimProcessingTime,
      maxClaimAmount: product.maxClaimAmount ? parseFloat(product.maxClaimAmount.toString()) : null,
      deductible: product.deductible ? parseFloat(product.deductible.toString()) : 0,
      icon: iconMap[product.productType] || "Shield",
      color: getColorForProductType(product.productType),
    }))

    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error("[INSURANCE_PRODUCTS_GET_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch insurance products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

function getColorForProductType(productType: string): string {
  const colorMap: Record<string, string> = {
    crop: "text-green-500",
    health: "text-red-500",
    loan_protection: "text-blue-500",
    savings_fraud: "text-purple-500",
    mobile: "text-orange-500",
    weather: "text-cyan-500",
  }
  return colorMap[productType] || "text-gray-500"
}

