import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: Request,
  context: RouteParams
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount } = await request.json();
    if (!amount || isNaN(amount) || amount <= 0) {
      return new NextResponse("Invalid amount", { status: 400 });
    }

    const { id: groupId } = await context.params;

    // Get user and their wallet
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: { 
        wallet: true,
        memberships: {
          where: { groupId }
        }
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!user.wallet) {
      return new NextResponse("Wallet not found", { status: 404 });
    }

    if (user.wallet.balance < amount) {
      return new NextResponse("Insufficient funds", { status: 400 });
    }

    if (!user.memberships.length) {
      return new NextResponse("You are not a member of this group", { status: 403 });
    }

    // Get group
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return new NextResponse("Group not found", { status: 404 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create contribution
      const contribution = await tx.contribution.create({
        data: {
          amount,
          userId: user.id,
          groupId: group.id,
          status: "COMPLETED"
        },
      });

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: "CONTRIBUTION",
          status: "COMPLETED",
          description: `Contribution to ${group.name}`,
          userId: user.id,
          groupId: group.id,
        },
      });

      // Update contribution with transaction ID
      await tx.contribution.update({
        where: { id: contribution.id },
        data: { transactionId: transaction.id },
      });

      // Update wallet balance
      await tx.wallet.update({
        where: { id: user.wallet!.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Update membership balance and total contributed
      await tx.membership.update({
        where: { id: user.memberships[0].id },
        data: {
          balance: {
            increment: amount,
          },
          totalContributed: {
            increment: amount,
          },
          lastContribution: new Date(),
        },
      });

      return { contribution, transaction };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CONTRIBUTION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 