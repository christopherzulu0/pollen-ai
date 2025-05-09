import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's savings goal
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: params.id,
        user: {
          clerkUserId
        }
      }
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    // Get transactions for this goal
    const transactions = await prisma.savingsTransaction.findMany({
      where: {
        savingsGoalId: goal.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, type } = await req.json();
    if (!amount || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const goal = await prisma.savingsGoal.findUnique({
      where: { id: params.id },
    });

    if (!goal) {
      return new NextResponse("Savings goal not found", { status: 404 });
    }

    if (type === "WITHDRAWAL" && goal.currentAmount < amount) {
      return new NextResponse("Insufficient funds", { status: 400 });
    }

    const transaction = await prisma.savingsTransaction.create({
      data: {
        savingsGoalId: params.id,
        amount,
        type,
        description: `${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} of $${amount.toFixed(2)}`,
      },
    });

    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: params.id },
      data: {
        currentAmount: {
          increment: type === "DEPOSIT" ? amount : -amount,
        },
        isCompleted: type === "DEPOSIT" && goal.currentAmount + amount >= goal.targetAmount,
      },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("[SAVINGS_TRANSACTION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 