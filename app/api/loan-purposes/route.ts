import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// This endpoint returns loan purpose data
// In a real application, this would fetch from a database
// For now, we're returning structured data that was previously hardcoded in the component
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.userId === null) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Check if user exists in our database
    let dbUser = await prisma.user.findFirst({
      where: { 
        clerkUserId: session?.userId 
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the URL and parse query parameters
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');

    // Get user's memberships to determine which groups they belong to
    const userMemberships = await prisma.membership.findMany({
      where: {
        userId: dbUser.id
      },
      include: {
        group: true
      }
    });

    const userGroupIds = userMemberships.map(membership => membership.groupId);

    // In a real application, this data would come from a database
    // For now, we're structuring it as if it came from a database
    const loanPurposeData = [
      {
        id: "business",
        name: "Business",
        value: 6,
        color: "#6366f1",
        trend: "+12%",
        trendDirection: "up",
        iconName: "Briefcase",
        description: "Small business funding and expansion capital",
        avgAmount: 2500,
        totalAmount: 15000,
        successRate: 92,
        riskLevel: "Low",
        interestRate: "8.5%",
        term: "24 months",
        popularIn: ["Urban areas", "Tech hubs"],
        topContributors: ["Robert J.", "John D."],
        groupId: "group1"
      },
      {
        id: "education",
        name: "Education",
        value: 4,
        color: "#06b6d4",
        trend: "+5%",
        trendDirection: "up",
        iconName: "GraduationCap",
        description: "Tuition fees and educational expenses",
        avgAmount: 1800,
        totalAmount: 7200,
        successRate: 95,
        riskLevel: "Very Low",
        interestRate: "6.5%",
        term: "36 months",
        popularIn: ["College towns", "Suburban areas"],
        topContributors: ["Sarah W.", "Lisa T."],
        groupId: "group2"
      },
      {
        id: "medical",
        name: "Medical",
        value: 3,
        color: "#8b5cf6",
        trend: "-3%",
        trendDirection: "down",
        iconName: "Stethoscope",
        description: "Healthcare costs and medical procedures",
        avgAmount: 2200,
        totalAmount: 6600,
        successRate: 88,
        riskLevel: "Medium",
        interestRate: "7.5%",
        term: "18 months",
        popularIn: ["Rural areas", "Retirement communities"],
        topContributors: ["Jane S.", "Michael B."],
        groupId: "group1"
      },
      {
        id: "home",
        name: "Home Improvement",
        value: 2,
        color: "#f59e0b",
        trend: "+8%",
        trendDirection: "up",
        iconName: "Home",
        description: "Renovations and home repairs",
        avgAmount: 3000,
        totalAmount: 6000,
        successRate: 94,
        riskLevel: "Low",
        interestRate: "7.0%",
        term: "30 months",
        popularIn: ["Suburban areas", "Established neighborhoods"],
        topContributors: ["Robert J.", "Lisa T."],
        groupId: "group3"
      },
      {
        id: "emergency",
        name: "Emergency",
        value: 2,
        color: "#10b981",
        trend: "+0%",
        trendDirection: "neutral",
        iconName: "ShieldAlert",
        description: "Urgent unexpected expenses",
        avgAmount: 1200,
        totalAmount: 2400,
        successRate: 85,
        riskLevel: "Medium-High",
        interestRate: "9.0%",
        term: "12 months",
        popularIn: ["Urban areas", "Low-income communities"],
        topContributors: ["David K.", "Michael B."],
        groupId: "group2"
      },
    ];

    // Filter by group if specified
    let filteredPurposes = loanPurposeData;
    if (groupId && groupId !== 'all') {
      filteredPurposes = loanPurposeData.filter(purpose => purpose.groupId === groupId);
    } else {
      // If no specific group is selected, only show purposes from groups the user is a member of
      filteredPurposes = loanPurposeData.filter(purpose => 
        userGroupIds.includes(purpose.groupId) || purpose.groupId === 'all'
      );
    }

    // Get trend data
    const purposeTrendData = [
      { month: "Jan", Business: 4, Education: 3, Medical: 3, "Home Improvement": 1, Emergency: 2 },
      { month: "Feb", Business: 5, Education: 3, Medical: 4, "Home Improvement": 1, Emergency: 2 },
      { month: "Mar", Business: 5, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 1 },
      { month: "Apr", Business: 6, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 2 },
      { month: "May", Business: 6, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 2 },
      { month: "Jun", Business: 6, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 2 },
    ];

    return NextResponse.json({
      purposes: filteredPurposes,
      trendData: purposeTrendData
    });
  } catch (error) {
    console.error("Error fetching loan purposes:", error);
    return NextResponse.json(
      { error: "Failed to fetch loan purposes" },
      { status: 500 }
    );
  }
}