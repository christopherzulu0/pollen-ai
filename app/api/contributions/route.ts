import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.userId === null) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Get the URL parameters
    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId");

    // Find the user in our database
    const dbUser = await prisma.user.findFirst({
      where: { 
        clerkUserId: session.userId 
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Base query to get contributions from groups where the user is a member
    let query: any = {
      where: {
        group: {
          memberships: {
            some: {
              userId: dbUser.id
            }
          }
        },
        status: "COMPLETED"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        group: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    };

    // If groupId is provided, filter by that specific group
    if (groupId) {
      query.where.groupId = groupId;
    }

    // Get all contributions
    const contributions = await prisma.contribution.findMany(query);

    // Get unique contributors and calculate their statistics
    const contributorsMap = new Map();
    
    contributions.forEach(contribution => {
      const userId = contribution.userId;
      
      if (!contributorsMap.has(userId)) {
        contributorsMap.set(userId, {
          id: userId,
          name: contribution.user.name,
          avatar: contribution.user.avatar,
          value: 0, // Current contribution amount
          totalContributed: 0,
          lastContribution: null,
          reliability: 100, // Default to 100%
          trend: "+0%", // Default trend
          trendDirection: "up",
          totalLoans: 0, // This would need to be calculated separately
          badge: null,
          contributionHistory: []
        });
      }
      
      const contributor = contributorsMap.get(userId);
      contributor.totalContributed += Number(contribution.amount);
      
      // Update last contribution date if this is more recent
      if (!contributor.lastContribution || new Date(contribution.createdAt) > new Date(contributor.lastContribution)) {
        contributor.lastContribution = contribution.createdAt;
        contributor.value = Number(contribution.amount); // Most recent contribution amount
      }
      
      // Add to contribution history (we'll keep the 5 most recent)
      contributor.contributionHistory.push(Number(contribution.amount));
      if (contributor.contributionHistory.length > 5) {
        contributor.contributionHistory.shift(); // Remove oldest
      }
    });
    
    // Calculate trends and reliability for each contributor
    const contributors = Array.from(contributorsMap.values()).map(contributor => {
      // Calculate trend based on contribution history
      if (contributor.contributionHistory.length >= 2) {
        const oldest = contributor.contributionHistory[0];
        const newest = contributor.contributionHistory[contributor.contributionHistory.length - 1];
        const percentChange = oldest > 0 ? ((newest - oldest) / oldest) * 100 : 0;
        
        contributor.trend = `${percentChange >= 0 ? '+' : ''}${Math.round(percentChange)}%`;
        contributor.trendDirection = percentChange >= 0 ? "up" : "down";
      }
      
      // Format last contribution as relative time
      if (contributor.lastContribution) {
        const now = new Date();
        const contributionDate = new Date(contributor.lastContribution);
        const diffDays = Math.floor((now.getTime() - contributionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          contributor.lastContribution = "today";
        } else if (diffDays === 1) {
          contributor.lastContribution = "yesterday";
        } else if (diffDays < 7) {
          contributor.lastContribution = `${diffDays} days ago`;
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          contributor.lastContribution = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else {
          const months = Math.floor(diffDays / 30);
          contributor.lastContribution = `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
      }
      
      // Assign badges based on contribution amount
      if (contributor.totalContributed > 10000) {
        contributor.badge = "Top Contributor";
      } else if (contributor.totalContributed > 8000) {
        contributor.badge = "Power Lender";
      } else if (contributor.totalContributed > 5000) {
        contributor.badge = "Consistent";
      }
      
      return contributor;
    });
    
    // Sort by total contributed amount (descending)
    contributors.sort((a, b) => b.totalContributed - a.totalContributed);
    
    // Calculate total statistics
    const totalContributions = contributions.reduce((sum, contribution) => sum + Number(contribution.amount), 0);
    const totalActiveContributors = contributors.length;
    
    return NextResponse.json({
      contributors,
      statistics: {
        totalContributions,
        totalActiveContributors
      }
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}