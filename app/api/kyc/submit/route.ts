import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      kycLevel, // 1, 2, or 3
      // Level 1 - Basic Info
      fullName,
      email,
      phone,
      dateOfBirth,
      nationalId,
      address,
      // Level 2 - Documents (URLs after upload)
      nrcFrontUrl,
      nrcBackUrl,
      proofOfAddressUrl,
      selfieUrl,
      // Level 3 - Enhanced
      bankStatementUrl,
      employmentLetterUrl,
      videoKycUrl,
    } = body

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validate based on KYC level
    if (kycLevel === 1) {
      if (!fullName || !email || !phone || !dateOfBirth || !nationalId || !address) {
        return NextResponse.json(
          { error: "All Level 1 fields are required: fullName, email, phone, dateOfBirth, nationalId, address" },
          { status: 400 }
        )
      }
    } else if (kycLevel === 2) {
      if (!fullName || !email || !phone || !dateOfBirth || !nationalId || !address) {
        return NextResponse.json(
          { error: "All Level 1 fields are required" },
          { status: 400 }
        )
      }
      if (!nrcFrontUrl || !nrcBackUrl || !proofOfAddressUrl || !selfieUrl) {
        return NextResponse.json(
          { error: "All Level 2 documents are required: nrcFrontUrl, nrcBackUrl, proofOfAddressUrl, selfieUrl" },
          { status: 400 }
        )
      }
    } else if (kycLevel === 3) {
      if (!fullName || !email || !phone || !dateOfBirth || !nationalId || !address) {
        return NextResponse.json(
          { error: "All Level 1 fields are required" },
          { status: 400 }
        )
      }
      if (!nrcFrontUrl || !nrcBackUrl || !proofOfAddressUrl || !selfieUrl) {
        return NextResponse.json(
          { error: "All Level 2 documents are required" },
          { status: 400 }
        )
      }
      if (!bankStatementUrl || !employmentLetterUrl || !videoKycUrl) {
        return NextResponse.json(
          { error: "All Level 3 fields are required: bankStatementUrl, employmentLetterUrl, videoKycUrl" },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "Invalid KYC level. Must be 1, 2, or 3" },
        { status: 400 }
      )
    }

    // Update user with basic information
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: fullName,
        email: email,
        phone: phone,
        nationalId: nationalId,
        address: address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    })

    // For Level 2 and 3, create or update PersonalLoanDocuments
    let kycDocuments = null
    if (kycLevel >= 2) {
      const existingDocuments = await prisma.personalLoanDocuments.findUnique({
        where: { userId: user.id },
      })

      // Build document data - PaySlip is required in schema, so use a placeholder for Level 2
      const documentData: any = {
        Nrcfront: nrcFrontUrl,
        NrcBack: nrcBackUrl,
        ProofOfAddress: proofOfAddressUrl || null,
        LiveSelfie: selfieUrl || null,
        PaySlip: employmentLetterUrl || (kycLevel === 2 ? "" : null), // PaySlip is required, use empty string for Level 2
        BankStatement: bankStatementUrl || null,
      }

      // Add Level 3 fields if present
      if (kycLevel === 3) {
        documentData.VideoKycUrl = videoKycUrl || null
      }

      if (existingDocuments) {
        kycDocuments = await prisma.personalLoanDocuments.update({
          where: { userId: user.id },
          data: documentData,
        })
      } else {
        // Create new documents - use relation connect syntax
        kycDocuments = await prisma.personalLoanDocuments.create({
          data: {
            user: {
              connect: { id: user.id },
            },
            ...documentData,
          },
        })
      }
    }

    return NextResponse.json({
      message: `KYC Level ${kycLevel} submission successful`,
      kycLevel,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        nationalId: updatedUser.nationalId,
        address: updatedUser.address,
        dateOfBirth: updatedUser.dateOfBirth?.toISOString() || null,
      },
      documents: kycDocuments,
      videoKycUrl: videoKycUrl || null,
      submissionDate: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[KYC_SUBMIT_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to submit KYC application" },
      { status: 500 }
    )
  }
}

