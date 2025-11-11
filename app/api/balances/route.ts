import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user with their wallet, groups, and savings goals
    let user = await prisma.user.findUnique({
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
      // User not found in database, create a new user with Clerk information
      const clerkUser = await currentUser();

      // Create a new user
      user = await prisma.user.create({
        data: {
          name: clerkUser?.firstName && clerkUser?.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser?.username || "User" + Date.now(),
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@example.com`,
          password: "clerk-auth", // This is a placeholder since we're using Clerk for auth
          avatar: clerkUser?.imageUrl || null,
          clerkUserId: userId,
          wallet: {
            create: {} // Create an empty wallet for the user
          },
          personalSavings: {
            create: {} // Create empty personal savings for the user
          }
        },
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
