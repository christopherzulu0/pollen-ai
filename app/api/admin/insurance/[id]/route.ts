import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// PATCH endpoint to update an insurance product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()

    // Map product type from form to schema format
    const productTypeMap: Record<string, string> = {
      crop: "crop",
      health: "health",
      loan: "loan_protection",
      fraud: "savings_fraud",
      mobile: "mobile",
      weather: "weather",
    }

    // Map premium frequency
    const frequencyMap: Record<string, string> = {
      monthly: "MONTHLY",
      quarterly: "QUARTERLY",
      seasonal: "SEASONAL",
      annual: "ANNUAL",
    }

    // Build update data
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.productType) {
      const productType = productTypeMap[data.productType] || data.productType
      updateData.productType = productType
    }
    if (data.description !== undefined) updateData.description = data.description
    if (data.coverageAmount) updateData.coverageAmount = parseFloat(data.coverageAmount)
    if (data.premiumAmount) updateData.premiumAmount = parseFloat(data.premiumAmount)
    if (data.premiumFrequency) {
      const premiumFrequency = frequencyMap[data.premiumFrequency.toLowerCase()] || data.premiumFrequency
      updateData.premiumFrequency = premiumFrequency
    }
    if (data.claimProcessingTime) updateData.claimProcessingTime = data.claimProcessingTime
    if (data.coverageTerms !== undefined) updateData.coverageTerms = data.coverageTerms
    if (data.exclusions !== undefined) updateData.exclusions = data.exclusions
    if (data.status) updateData.status = data.status

    // Update the insurance product
    const updatedProduct = await prisma.insuranceProduct.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("[ADMIN_INSURANCE_UPDATE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to update insurance product" },
      { status: 500 }
    )
  }
}

