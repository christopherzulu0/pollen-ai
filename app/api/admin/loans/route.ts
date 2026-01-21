import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch all loans for admin
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const loanType = searchParams.get("loanType")
    const search = searchParams.get("search")

    // Build where clauses
    const loanRequestWhere: any = {}
    const individualLoanWhere: any = {}

    if (status && status !== "all") {
      loanRequestWhere.status = status
      individualLoanWhere.status = status
    }

    if (search) {
      loanRequestWhere.OR = [
        { purpose: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
      individualLoanWhere.OR = [
        { purpose: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch group loans (LoanRequest)
    const groupLoans = loanType === "INDIVIDUAL" ? [] : await prisma.loanRequest.findMany({
      where: loanRequestWhere,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            nationalId: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
            interestRate: true,
          },
        },
        votes: {
          select: {
            vote: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Fetch individual loans (IndividualLoan)
    const individualLoans = loanType === "GROUP" ? [] : await prisma.individualLoan.findMany({
      where: individualLoanWhere,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            nationalId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get total members for each group loan
    const groupLoansWithMembers = await Promise.all(
      groupLoans.map(async (loan) => {
        const totalMembers = loan.groupId
          ? await prisma.membership.count({
              where: {
                groupId: loan.groupId,
                status: "ACTIVE",
              },
            })
          : 0
        return { ...loan, totalMembers }
      })
    )

    // Transform group loans
    const transformedGroupLoans = groupLoansWithMembers.map((loanData) => {
      const { totalMembers, ...loan } = loanData
      const approveVotes = loan.votes.filter((v) => v.vote === true).length
      const rejectVotes = loan.votes.filter((v) => v.vote === false).length
      const pendingVotes = Math.max(0, totalMembers - approveVotes - rejectVotes)

      return {
        id: loan.id,
        borrower: {
          name: loan.user.name || "Unknown User",
          email: loan.user.email || "",
          avatar: loan.user.avatar || null,
          phone: loan.user.phone || "",
          nationalId: loan.user.nationalId || "",
        },
        amount: Number(loan.amount),
        purpose: loan.purpose,
        status: loan.status,
        loanType: "GROUP" as const,
        groupName: loan.group?.name || null,
        votes: {
          approve: approveVotes,
          reject: rejectVotes,
          pending: pendingVotes,
          total: totalMembers,
        },
        date: loan.createdAt.toISOString().split("T")[0],
        repaymentDate: loan.repaymentDate.toISOString().split("T")[0],
        installments: loan.installments,
        interestRate: Number(loan.group?.interestRate || 0),
        totalRepayment: Number(loan.amount) * (1 + Number(loan.group?.interestRate || 0) / 100),
        documents: [], // Would need to fetch from documents table
        creditScore: 75, // Would need to calculate or fetch
        riskLevel: "Medium" as const,
        employmentStatus: "Unknown",
        monthlyIncome: 0,
      }
    })

    // Transform individual loans
    const transformedIndividualLoans = individualLoans.map((loan) => {
      // Parse repaymentPeriod (e.g., "12 months" or just "12")
      const monthsMatch = loan.repaymentPeriod.match(/(\d+)/)
      const months = monthsMatch ? parseInt(monthsMatch[1]) : 12
      
      // Calculate repayment date from createdAt + months
      const repaymentDate = new Date(loan.createdAt)
      repaymentDate.setMonth(repaymentDate.getMonth() + months)
      
      // Calculate interest rate based on service type and repayment period
      // Solar Equipment: 20%, Personal Loans: 10%
      const isSolarEquipment = loan.serviceType === "Solar Equipment" || 
                               loan.serviceName?.toLowerCase().includes("solar") ||
                               loan.serviceCategory?.toLowerCase().includes("solar")
      const baseInterestRate = isSolarEquipment ? 20 : 10 // 20% for Solar, 10% for Personal
      
      // Interest rate can vary based on repayment period (longer periods might have different rates)
      // For now, using base rate, but this can be adjusted based on business logic
      const interestRate = baseInterestRate
      const totalRepayment = Number(loan.amount) * (1 + interestRate / 100)
      
      return {
        id: loan.id,
        borrower: {
          name: loan.fullName || loan.user?.name || "Unknown User",
          email: loan.email || loan.user?.email || "",
          avatar: loan.user?.avatar || null,
          phone: loan.phone || loan.user?.phone || "",
          nationalId: loan.nationalId || loan.user?.nationalId || "",
        },
        amount: Number(loan.amount),
        purpose: loan.purpose,
        status: loan.status,
        loanType: "INDIVIDUAL" as const,
        groupName: null,
        votes: {
          approve: 1,
          reject: 0,
          pending: 0,
          total: 1,
        },
        date: loan.createdAt.toISOString().split("T")[0],
        repaymentDate: repaymentDate.toISOString().split("T")[0],
        installments: months,
        interestRate: interestRate,
        totalRepayment: totalRepayment,
        documents: [], // Would need to fetch from documents table
        creditScore: 75, // Would need to calculate or fetch
        riskLevel: "Medium" as const,
        employmentStatus: loan.employmentStatus || "Unknown",
        monthlyIncome: loan.monthlyIncome ? Number(loan.monthlyIncome) : 0,
      }
    })

    // Combine and return all loans
    const allLoans = [...transformedGroupLoans, ...transformedIndividualLoans]

    return NextResponse.json(allLoans)
  } catch (error) {
    console.error("[ADMIN_LOANS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch loans" },
      { status: 500 }
    )
  }
}

