import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    {/**  Get the user with their wallet, groups, and savings goals */}
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        wallet: true,
        personalSavings: true,
        memberships: {
          include: {
            group: {
              include: {
                memberships: true
              }
            }
          }
        },
        savingsGoals: true
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Format the response
    const response = {
      walletBalance: user.wallet?.balance || 0,
      savingsBalance: user.personalSavings?.balance || 0,
      groups: user.memberships.map(membership => {
        // Calculate total contributions for the group by summing all members' totalContributed
        const groupTotalContributions = membership.group.memberships.reduce(
          (total, m) => total + Number(m.totalContributed || 0),
          0
        );

        return {
          id: membership.group.id,
          name: membership.group.name,
          description: membership.group.description,
          userBalance: membership.balance,
          totalContributions: groupTotalContributions,
          contributionAmount: membership.group.contributionAmount,
          createdAt: membership.group.createdAt,
          status: membership.group.status,
          nextContributionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
      }),
      savingsGoals: user.savingsGoals.map(goal => ({
        id: goal.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[BALANCES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
