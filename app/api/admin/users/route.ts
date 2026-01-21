import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch all users for admin
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const role = searchParams.get("role")

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { nationalId: { contains: search, mode: "insensitive" } },
      ]
    }

    if (role && role !== "all") {
      where.isAdmin = role === "admin"
    }

    // Note: User model doesn't have a status field, so we'll use isActive if it exists
    // For now, we'll skip status filtering or use a different approach

    // Fetch all users with related data
    const users = await prisma.user.findMany({
      where,
      include: {
        wallet: {
          select: {
            id: true,
            balance: true,
            celoAddress: true,
            celoBalance: true,
            cusdBalance: true,
            network: true,
            isConnected: true,
          },
        },
        memberships: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        contributions: {
          select: {
            amount: true,
          },
        },
        loanRequests: {
          where: {
            status: {
              in: ["PENDING", "APPROVED", "DISBURSED", "REPAYING"],
            },
          },
          select: {
            id: true,
          },
        },
        savingsGoals: {
          select: {
            id: true,
          },
        },
        transactions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform users to match component's expected format
    const transformedUsers = users.map((user) => {
      const totalContributed = user.contributions.reduce(
        (sum, c) => sum + Number(c.amount),
        0
      )

      return {
        id: user.id,
        name: user.name || "Unknown User",
        email: user.email,
        phone: user.phone || "",
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString().split("T")[0],
        status: "active", // Default status since User model doesn't have status field
        avatar: user.avatar || null,
        nationalId: user.nationalId || "",
        address: user.address || "",
        wallet: {
          balance: user.wallet ? Number(user.wallet.balance) : 0,
          celoBalance: user.wallet?.celoBalance || "0",
          cusdBalance: user.wallet?.cusdBalance || "0",
          celoAddress: user.wallet?.celoAddress || null,
          network: user.wallet?.network || null,
          isConnected: user.wallet?.isConnected || false,
        },
        stats: {
          groups: user.memberships.length,
          transactions: user.transactions.length,
          totalContributed,
          activeLoans: user.loanRequests.length,
          savingsGoals: user.savingsGoals.length,
        },
      }
    })

    // Calculate statistics
    const stats = {
      totalUsers: transformedUsers.length,
      activeUsers: transformedUsers.filter((u) => u.status === "active").length,
      adminUsers: transformedUsers.filter((u) => u.isAdmin).length,
      totalWallets: transformedUsers.reduce((sum, u) => sum + u.wallet.balance, 0),
    }

    return NextResponse.json({
      users: transformedUsers,
      stats,
    })
  } catch (error) {
    console.error("[ADMIN_USERS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

