import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/activities
 * Fetch recent activities from groups where the user is a member
 */
export async function GET(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const type = searchParams.get("type"); // LOAN_REQUEST, CONTRIBUTION, etc.
    const limit = parseInt(searchParams.get("limit") || "20");

    // Find user in database
    const dbUser = await prisma.user.findFirst({
      where: { clerkUserId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all groups where user is an ACTIVE member
    const userMemberships = await prisma.membership.findMany({
      where: {
        userId: dbUser.id,
        status: "ACTIVE",
      },
      select: {
        groupId: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const userGroupIds = userMemberships.map((m) => m.groupId);

    if (userGroupIds.length === 0) {
      return NextResponse.json([]);
    }

    // Filter by specific group if provided
    const targetGroupIds = groupId ? [groupId] : userGroupIds;

    // Collect activities from different sources
    const activities: any[] = [];

    // 1. Loan Requests
    if (!type || type === "LOAN_REQUEST" || type === "LOAN_APPROVED" || type === "LOAN_REJECTED") {
      const loanRequests = await prisma.loanRequest.findMany({
        where: {
          groupId: { in: targetGroupIds },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          group: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      loanRequests.forEach((loan) => {
        let activityType = "LOAN_REQUEST";
        if (loan.status === "APPROVED") activityType = "LOAN_APPROVED";
        if (loan.status === "REJECTED") activityType = "LOAN_REJECTED";

        activities.push({
          id: `loan-${loan.id}`,
          type: activityType,
          user: {
            name: loan.user.name || "Unknown User",
            avatar: loan.user.avatar || null,
          },
          description:
            loan.status === "PENDING"
              ? `requested a loan of K${Number(loan.amount).toLocaleString()}`
              : loan.status === "APPROVED"
              ? `loan request of K${Number(loan.amount).toLocaleString()} was approved`
              : `loan request of K${Number(loan.amount).toLocaleString()} was rejected`,
          time: loan.createdAt,
          status: loan.status,
          group: loan.group.name,
        });
      });
    }

    // 2. Contributions
    if (!type || type === "CONTRIBUTION") {
      const contributions = await prisma.contribution.findMany({
        where: {
          groupId: { in: targetGroupIds },
          status: "COMPLETED",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          group: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      contributions.forEach((contribution) => {
        activities.push({
          id: `contribution-${contribution.id}`,
          type: "CONTRIBUTION",
          user: {
            name: contribution.user.name || "Unknown User",
            avatar: contribution.user.avatar || null,
          },
          description: `contributed K${Number(contribution.amount).toLocaleString()} to the group`,
          time: contribution.createdAt,
          status: "COMPLETED",
          group: contribution.group.name,
        });
      });
    }

    // 3. New Members
    if (!type || type === "MEMBER_JOINED") {
      const newMembers = await prisma.membership.findMany({
        where: {
          groupId: { in: targetGroupIds },
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          group: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          joinedAt: "desc",
        },
        take: limit,
      });

      newMembers.forEach((member) => {
        // Only show if joined in last 30 days
        const joinDate = new Date(member.joinedAt);
        const now = new Date();
        const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceJoin <= 30) {
          activities.push({
            id: `member-${member.id}`,
            type: "MEMBER_JOINED",
            user: {
              name: member.user.name || "Unknown User",
              avatar: member.user.avatar || null,
            },
            description: `joined ${member.group.name}`,
            time: member.joinedAt,
            status: "COMPLETED",
            group: member.group.name,
          });
        }
      });
    }

    // 4. Payments (Transactions)
    if (!type || type === "PAYMENT") {
      const payments = await prisma.transaction.findMany({
        where: {
          groupId: { in: targetGroupIds },
          type: { in: ["WITHDRAWAL", "LOAN_REPAYMENT"] },
          status: "COMPLETED",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          group: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      payments.forEach((payment) => {
        const description = payment.type === "LOAN_REPAYMENT" 
          ? `made a loan repayment of K${Number(payment.amount).toLocaleString()}`
          : `made a payment of K${Number(payment.amount).toLocaleString()}`;

        activities.push({
          id: `payment-${payment.id}`,
          type: "PAYMENT",
          user: {
            name: payment.user.name || "Unknown User",
            avatar: payment.user.avatar || null,
          },
          description,
          time: payment.createdAt,
          status: "COMPLETED",
          group: payment.group.name,
        });
      });
    }

    // Sort all activities by time (most recent first)
    activities.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    // Limit total activities
    const limitedActivities = activities.slice(0, limit);

    // Format time to relative string
    const formattedActivities = limitedActivities.map((activity) => {
      const activityTime = new Date(activity.time);
      const now = new Date();
      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let timeString = "";
      if (diffMins < 1) {
        timeString = "Just now";
      } else if (diffMins < 60) {
        timeString = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      } else if (diffHours < 24) {
        timeString = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else if (diffDays === 1) {
        timeString = "Yesterday";
      } else if (diffDays < 7) {
        timeString = `${diffDays} days ago`;
      } else {
        timeString = activityTime.toLocaleDateString();
      }

      return {
        ...activity,
        time: timeString,
      };
    });

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch activities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

