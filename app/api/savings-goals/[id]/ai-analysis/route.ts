import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { generateAIAnalysis } from "@/lib/ai-analysis-helper"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params (Next.js 15+)
    const { id } = await params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Verify the goal belongs to the user
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    })

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      )
    }

    // Get the latest AI analysis from database
    const latestAnalysis = await prisma.aIGoalAnalysis.findFirst({
      where: {
        savingsGoalId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!latestAnalysis) {
      return NextResponse.json(
        { error: "No analysis available yet. Analysis is generated automatically when you create or update your goal." },
        { status: 404 }
      )
    }

    // Format the response
    return NextResponse.json({
      success: true,
      data: {
        creditScore: latestAnalysis.creditScore,
        scoreCategory: latestAnalysis.scoreCategory,
        riskLevel: latestAnalysis.riskLevel,
        analysis: latestAnalysis.analysis,
        recommendations: latestAnalysis.recommendations,
        predictedCompletionDate: latestAnalysis.predictedCompletionDate.toISOString().split('T')[0],
        onTrack: latestAnalysis.onTrack,
        confidence: latestAnalysis.confidence,
        goalId: id,
        analyzedAt: latestAnalysis.createdAt.toISOString(),
        metrics: {
          progressPercentage: Number(latestAnalysis.progressPercentage).toFixed(1),
          avgMonthlyContribution: Number(latestAnalysis.avgMonthlyContribution).toFixed(2),
          requiredMonthlyContribution: Number(latestAnalysis.requiredMonthlyContribution).toFixed(2),
          daysUntilDeadline: latestAnalysis.daysUntilDeadline,
          remainingAmount: Number(latestAnalysis.remainingAmount),
        }
      }
    })

  } catch (error) {
    console.error("Error fetching AI analysis:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch AI analysis",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params (Next.js 15+)
    const { id } = await params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get the savings goal with transactions
    const goal = await prisma.savingsGoal.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      )
    }

    // Generate fresh AI analysis
    const analysis = await generateAIAnalysis(id)

    if (!analysis) {
      return NextResponse.json(
        { error: "Failed to generate AI analysis" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        goalId: id,
        analyzedAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate AI analysis",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

