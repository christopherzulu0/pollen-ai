import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        personalDocuments: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check what data exists
    const hasPersonalInfo =
      user.name &&
      user.email &&
      user.phone &&
      user.dateOfBirth &&
      user.nationalId &&
      user.address

    const hasLevel2Documents =
      user.personalDocuments &&
      user.personalDocuments.Nrcfront &&
      user.personalDocuments.NrcBack &&
      user.personalDocuments.ProofOfAddress &&
      user.personalDocuments.LiveSelfie

    const hasLevel3Documents =
      user.personalDocuments &&
      user.personalDocuments.BankStatement &&
      user.personalDocuments.PaySlip &&
      user.personalDocuments.VideoKycUrl

    // Determine current KYC level
    let currentKycLevel = 0
    if (hasPersonalInfo) {
      currentKycLevel = 1
      if (hasLevel2Documents) {
        currentKycLevel = 2
        if (hasLevel3Documents) {
          currentKycLevel = 3
        }
      }
    }

    return NextResponse.json({
      hasPersonalInfo,
      hasLevel2Documents,
      hasLevel3Documents,
      currentKycLevel,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth?.toISOString() || null,
        nationalId: user.nationalId,
        address: user.address,
      },
      documents: user.personalDocuments
        ? {
            nrcFrontUrl: user.personalDocuments.Nrcfront,
            nrcBackUrl: user.personalDocuments.NrcBack,
            proofOfAddressUrl: user.personalDocuments.ProofOfAddress,
            selfieUrl: user.personalDocuments.LiveSelfie,
            bankStatementUrl: user.personalDocuments.BankStatement,
            employmentLetterUrl: user.personalDocuments.PaySlip,
            videoKycUrl: user.personalDocuments.VideoKycUrl,
          }
        : null,
    })
  } catch (error) {
    console.error("[KYC_STATUS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch KYC status" },
      { status: 500 }
    )
  }
}

