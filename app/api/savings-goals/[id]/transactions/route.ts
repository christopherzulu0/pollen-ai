import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { triggerBackgroundAnalysis } from "@/lib/ai-analysis-helper";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params (Next.js 15+)
    const { id } = await params;

    // Get the user's savings goal
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Await params (Next.js 15+)
    const { id } = await params;

    const { amount, type } = await req.json();
    if (!amount || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const goal = await prisma.savingsGoal.findUnique({
      where: { id: id },
    });

    if (!goal) {
      return new NextResponse("Savings goal not found", { status: 404 });
    }

    if (type === "WITHDRAWAL" && goal.currentAmount < amount) {
      return new NextResponse("Insufficient funds", { status: 400 });
    }

    const transaction = await prisma.savingsTransaction.create({
      data: {
        savingsGoalId: id,
        amount,
        type,
        description: `${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} of $${amount.toFixed(2)}`,
      },
    });

    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: id },
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

    // Trigger AI analysis in background after transaction
    triggerBackgroundAnalysis(id);
    console.log(`🤖 AI analysis triggered after ${type} transaction of K${amount} on goal: ${goal.name}`);

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("[SAVINGS_TRANSACTION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 