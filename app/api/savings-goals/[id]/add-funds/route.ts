import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { amount } = data;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Get the user's savings goal
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: params.id,
        user: {
          clerkUserId
        }
      },
      include: {
        user: true
      }
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    // Get or create personal savings record
    let personalSavings = await prisma.personalSavings.findFirst({
      where: {
        userId: goal.userId
      }
    });

    if (!personalSavings) {
      personalSavings = await prisma.personalSavings.create({
        data: {
          userId: goal.userId,
          balance: 0
        }
      });
    }

    // Start a transaction to ensure both updates succeed or fail together
    const [updatedGoal] = await prisma.$transaction([
      // Update the goal's current amount
      prisma.savingsGoal.update({
        where: {
          id: params.id
        },
        data: {
          currentAmount: {
            increment: amount
          }
        }
      }),
      // Update the user's personal savings balance
      prisma.personalSavings.update({
        where: {
          id: personalSavings.id
        },
        data: {
          balance: {
            increment: amount
          }
        }
      })
    ]);

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Error adding funds to savings goal:", error);
    return NextResponse.json(
      { error: "Failed to add funds" },
      { status: 500 }
    );
  }
} 