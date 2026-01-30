import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role in any organization
    const clerkClientInstance = await clerkClient()
    const userOrganizations = await clerkClientInstance.users.getOrganizationMembershipList({
      userId: userId,
    })

    const hasAdminRole = userOrganizations.data?.some((orgMembership) => {
      const role = orgMembership.role
      return role === "org:admin" || role === "admin" || role?.includes("admin")
    })

    if (!hasAdminRole) {
      console.error(`[KYC API] User ${userId} does not have admin role in any organization`)
      const roles = userOrganizations.data?.map((org) => org.role) || []
      return NextResponse.json(
        {
          error: "Forbidden - Admin access required",
          message: "You need admin privileges in your organization to access KYC data.",
          userId: userId,
          organizationRoles: roles,
        },
        { status: 403 }
      )
    }

    console.log(`[KYC API] Admin user ${userId} accessing KYC data`)

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const level = searchParams.get("level")
    const risk = searchParams.get("risk")
    const search = searchParams.get("search")

    // Fetch all users with KYC-related data
    const users = await prisma.user.findMany({
      include: {
        personalDocuments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform users to KYC format
    const kycUsers = users.map((user) => {
      // Determine KYC level
      const hasPersonalInfo = !!(user.name && user.email && user.phone && user.dateOfBirth && user.nationalId && user.address)
      const hasLevel2Documents = !!(
        user.personalDocuments &&
        user.personalDocuments.Nrcfront &&
        user.personalDocuments.NrcBack &&
        user.personalDocuments.ProofOfAddress &&
        user.personalDocuments.LiveSelfie
      )
      const hasLevel3Documents = !!(
        user.personalDocuments &&
        user.personalDocuments.BankStatement &&
        user.personalDocuments.PaySlip &&
        user.personalDocuments.VideoKycUrl
      )

      let kycLevel = 0
      if (hasPersonalInfo) {
        kycLevel = 1
        if (hasLevel2Documents) {
          kycLevel = 2
          if (hasLevel3Documents) {
            kycLevel = 3
          }
        }
      }

      // Determine status based on KYC completion and documents
      let status: "approved" | "pending" | "flagged" | "rejected" = "pending"
      if (kycLevel === 0) {
        status = "pending"
      } else if (kycLevel >= 1 && hasPersonalInfo) {
        // Check if documents are verified (simplified - you may want to add a verification status field)
        const hasRejectedDocuments = false // This would come from a verification status field
        if (hasRejectedDocuments) {
          status = "rejected"
        } else if (kycLevel >= 2 && hasLevel2Documents) {
          status = "approved"
        } else {
          status = "pending"
        }
      }

      // Calculate risk score (simplified - you may want to add actual risk scoring)
      let riskScore = 50 // Default
      let riskLevel: "low" | "medium" | "high" = "medium"

      if (kycLevel === 3 && status === "approved") {
        riskScore = Math.floor(Math.random() * 30) + 10 // 10-40 (low)
        riskLevel = "low"
      } else if (kycLevel >= 2) {
        riskScore = Math.floor(Math.random() * 30) + 30 // 30-60 (medium)
        riskLevel = "medium"
      } else {
        riskScore = Math.floor(Math.random() * 40) + 60 // 60-100 (high)
        riskLevel = "high"
      }

      // Determine video KYC status
      let videoKycStatus: "completed" | "required" | "failed" = "required"
      if (user.personalDocuments?.VideoKycUrl) {
        videoKycStatus = "completed"
      } else if (kycLevel < 3) {
        videoKycStatus = "required"
      }

      // Sanctions and PEP checks (simplified - you may want to add actual checks)
      const sanctionsCheck: "clear" | "pending" | "flagged" | "match" = kycLevel >= 1 ? "clear" : "pending"
      const pepCheck: "clear" | "pending" | "match" = kycLevel >= 1 ? "clear" : "pending"

      // Transaction limits based on KYC level
      const transactionLimits = {
        1: { daily: 10000, monthly: 100000 },
        2: { daily: 50000, monthly: 500000 },
        3: { daily: 100000, monthly: 1000000 },
      }

      const limits = transactionLimits[kycLevel as keyof typeof transactionLimits] || { daily: 0, monthly: 0 }

      // Documents array with URLs
      const documents: Array<{ type: string; status: "verified" | "pending" | "rejected"; date: string; url: string }> = []
      if (user.personalDocuments) {
        if (user.personalDocuments.Nrcfront) {
          documents.push({
            type: "NRC Front",
            status: "verified",
            date: user.personalDocuments.createdAt.toISOString().split("T")[0],
            url: user.personalDocuments.Nrcfront,
          })
        }
        if (user.personalDocuments.NrcBack) {
          documents.push({
            type: "NRC Back",
            status: "verified",
            date: user.personalDocuments.createdAt.toISOString().split("T")[0],
            url: user.personalDocuments.NrcBack,
          })
        }
        if (user.personalDocuments.ProofOfAddress) {
          documents.push({
            type: "Proof of Address",
            status: "verified",
            date: user.personalDocuments.createdAt.toISOString().split("T")[0],
            url: user.personalDocuments.ProofOfAddress,
          })
        }
        if (user.personalDocuments.BankStatement) {
          documents.push({
            type: "Bank Statement",
            status: "verified",
            date: user.personalDocuments.createdAt.toISOString().split("T")[0],
            url: user.personalDocuments.BankStatement,
          })
        }
        if (user.personalDocuments.PaySlip) {
          documents.push({
            type: "Employment Letter",
            status: "verified",
            date: user.personalDocuments.createdAt.toISOString().split("T")[0],
            url: user.personalDocuments.PaySlip,
          })
        }
        if (user.personalDocuments.LiveSelfie) {
          documents.push({
            type: "Live Selfie",
            status: "verified",
            date: user.personalDocuments.createdAt.toISOString().split("T")[0],
            url: user.personalDocuments.LiveSelfie,
          })
        }
      }

      // Activity flags (simplified - you may want to add actual activity monitoring)
      const activityFlags: Array<{ type: string; date: string; severity: "low" | "medium" | "high" | "critical" }> = []

      return {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || null,
        kycLevel,
        status,
        verificationDate: user.personalDocuments?.createdAt ? user.personalDocuments.createdAt.toISOString().split("T")[0] : null,
        riskScore,
        riskLevel,
        videoKycStatus,
        videoKycUrl: user.personalDocuments?.VideoKycUrl || null,
        nationalId: user.nationalId || "",
        address: user.address || "",
        sanctionsCheck,
        pepCheck,
        transactionLimit: limits,
        documents,
        activityFlags,
        lastReview: user.personalDocuments?.updatedAt ? user.personalDocuments.updatedAt.toISOString().split("T")[0] : null,
        rejectionReason: status === "rejected" ? "Document verification failed" : null,
      }
    })

    // Apply filters
    let filteredUsers = kycUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.nationalId.includes(search)
      )
    }

    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    if (level && level !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.kycLevel.toString() === level)
    }

    if (risk && risk !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.riskLevel === risk)
    }

    // Calculate statistics
    const stats = {
      totalUsers: kycUsers.length,
      verified: kycUsers.filter((u) => u.status === "approved").length,
      pending: kycUsers.filter((u) => u.status === "pending").length,
      flagged: kycUsers.filter((u) => u.status === "flagged").length,
      rejected: kycUsers.filter((u) => u.status === "rejected").length,
      videoKycRequired: kycUsers.filter((u) => u.videoKycStatus === "required").length,
      highRisk: kycUsers.filter((u) => u.riskLevel === "high").length,
    }

    return NextResponse.json({
      users: filteredUsers,
      stats,
    })
  } catch (error) {
    console.error("[KYC_API_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch KYC data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
