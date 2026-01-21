import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// PATCH endpoint to approve or reject a loan
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
    const { action, note } = await req.json()

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or REJECT" },
        { status: 400 }
      )
    }

    // Check if it's a group loan (LoanRequest) or individual loan (IndividualLoan)
    const loanRequest = await prisma.loanRequest.findUnique({
      where: { id },
    })

    const individualLoan = loanRequest
      ? null
      : await prisma.individualLoan.findUnique({
          where: { id },
        })

    if (!loanRequest && !individualLoan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    // For individual loans, admin can directly approve/reject
    if (individualLoan) {
      const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED"
      
      const updatedLoan = await prisma.individualLoan.update({
        where: { id },
        data: {
          status: newStatus,
        },
      })

      return NextResponse.json({
        success: true,
        message: `Loan ${action === "APPROVE" ? "approved" : "rejected"} successfully`,
        loan: updatedLoan,
      })
    }

    // For group loans, we can update the status directly as admin
    if (loanRequest) {
      const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED"
      
      const updatedLoan = await prisma.loanRequest.update({
        where: { id },
        data: {
          status: newStatus,
        },
      })

      return NextResponse.json({
        success: true,
        message: `Loan ${action === "APPROVE" ? "approved" : "rejected"} successfully`,
        loan: updatedLoan,
      })
    }

    return NextResponse.json({ error: "Loan not found" }, { status: 404 })
  } catch (error) {
    console.error("[ADMIN_LOANS_PATCH_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to update loan" },
      { status: 500 }
    )
  }
}

