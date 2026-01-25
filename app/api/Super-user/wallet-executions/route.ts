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
      console.error(`[Wallet Executions API] User ${userId} does not have admin role in any organization`)
      const roles = userOrganizations.data?.map((org) => org.role) || []
      return NextResponse.json(
        {
          error: "Forbidden - Admin access required",
          message: "You need admin privileges in your organization to access wallet executions.",
          userId: userId,
          organizationRoles: roles,
        },
        { status: 403 }
      )
    }

    console.log(`[Wallet Executions API] Admin user ${userId} accessing wallet executions`)

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const executionType = searchParams.get("executionType")
    const direction = searchParams.get("direction")
    const limit = parseInt(searchParams.get("limit") || "100")

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (executionType) {
      where.executionType = executionType
    }
    if (direction) {
      where.direction = direction
    }

    // Fetch wallet executions
    const executions = await prisma.walletExecution.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // Calculate statistics
    const totalExecutions = await prisma.walletExecution.count()
    const pendingCount = await prisma.walletExecution.count({ where: { status: "PENDING" } })
    const submittedCount = await prisma.walletExecution.count({ where: { status: "SUBMITTED" } })
    const confirmedCount = await prisma.walletExecution.count({ where: { status: "CONFIRMED" } })
    const failedCount = await prisma.walletExecution.count({ where: { status: "FAILED" } })

    const bankTransferCount = await prisma.walletExecution.count({ where: { executionType: "BANK_TRANSFER" } })
    const mobileMoneyCount = await prisma.walletExecution.count({ where: { executionType: "MOBILE_MONEY" } })
    const blockchainCount = await prisma.walletExecution.count({ where: { executionType: "BLOCKCHAIN" } })

    const inboundCount = await prisma.walletExecution.count({ where: { direction: "INBOUND" } })
    const outboundCount = await prisma.walletExecution.count({ where: { direction: "OUTBOUND" } })

    // Transform executions to match component's expected format
    const transformedExecutions = executions.map((execution) => ({
      id: execution.id,
      executionType: execution.executionType,
      direction: execution.direction,
      amount: parseFloat(execution.amount.toString()),
      asset: execution.asset,
      currency: execution.currency,
      fromAddress: execution.fromAddress,
      toAddress: execution.toAddress,
      fromAccountName: execution.fromAccountName,
      toAccountName: execution.toAccountName,
      bankName: execution.bankName,
      accountNumber: execution.accountNumber,
      mobileNumber: execution.mobileNumber,
      mobileProvider: execution.mobileProvider,
      txHash: execution.txHash,
      blockNumber: execution.blockNumber,
      networkId: execution.networkId,
      gasUsed: execution.gasUsed ? parseFloat(execution.gasUsed.toString()) : null,
      status: execution.status,
      errorMessage: execution.errorMessage,
      retryCount: execution.retryCount,
      submittedAt: execution.submittedAt?.toISOString() || null,
      confirmedAt: execution.confirmedAt?.toISOString() || null,
      createdAt: execution.createdAt.toISOString(),
      updatedAt: execution.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      executions: transformedExecutions,
      stats: {
        totalExecutions,
        pendingCount,
        submittedCount,
        confirmedCount,
        failedCount,
        bankTransferCount,
        mobileMoneyCount,
        blockchainCount,
        inboundCount,
        outboundCount,
      },
    })
  } catch (error) {
    console.error("[WALLET_EXECUTIONS_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch wallet executions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

