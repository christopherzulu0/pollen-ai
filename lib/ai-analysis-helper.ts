import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIAnalysisResult {
  creditScore: number
  scoreCategory: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  riskLevel: 'Low' | 'Medium' | 'High'
  analysis: string
  recommendations: string[]
  predictedCompletionDate: string
  onTrack: boolean
  confidence: number
  metrics: {
    progressPercentage: string
    avgMonthlyContribution: string
    requiredMonthlyContribution: string
    daysUntilDeadline: number
    remainingAmount: number
  }
}

export async function generateAIAnalysis(goalId: string): Promise<AIAnalysisResult | null> {
  try {
    // Get the savings goal with transactions
    const goal = await prisma.savingsGoal.findUnique({
      where: { id: goalId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!goal) {
      console.warn(`Goal ${goalId} not found for AI analysis`)
      return null
    }

    // Calculate savings metrics
    const now = new Date()
    const daysUntilDeadline = Math.ceil((goal.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const remainingAmount = Number(goal.targetAmount) - Number(goal.currentAmount)
    const progressPercentage = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
    
    // Calculate average monthly contribution
    const deposits = goal.transactions.filter(t => t.type === 'DEPOSIT')
    const totalDeposited = deposits.reduce((sum, t) => sum + Number(t.amount), 0)
    const monthsActive = deposits.length > 0 
      ? Math.max(1, Math.ceil((now.getTime() - deposits[deposits.length - 1].createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)))
      : 1
    const avgMonthlyContribution = totalDeposited / monthsActive

    // Required monthly contribution to meet goal
    const monthsRemaining = Math.max(1, daysUntilDeadline / 30)
    const requiredMonthlyContribution = remainingAmount / monthsRemaining

    // Prepare context for AI
    const context = `
Analyze this personal savings goal:

Goal Details:
- Name: ${goal.name}
- Target Amount: K${Number(goal.targetAmount).toLocaleString()}
- Current Amount: K${Number(goal.currentAmount).toLocaleString()}
- Progress: ${progressPercentage.toFixed(1)}%
- Days Until Deadline: ${daysUntilDeadline} days
- Remaining Amount: K${remainingAmount.toLocaleString()}

Savings Behavior:
- Total Deposits Made: ${deposits.length}
- Average Monthly Contribution: K${avgMonthlyContribution.toFixed(2)}
- Required Monthly Contribution: K${requiredMonthlyContribution.toFixed(2)}
- Recent Transaction Pattern: ${deposits.slice(0, 5).map(t => `K${Number(t.amount).toLocaleString()} on ${t.createdAt.toLocaleDateString()}`).join(', ') || 'No deposits yet'}

Please provide:
1. A credit score (0-100) for this savings goal based on feasibility and current progress
2. Risk assessment (Low/Medium/High)
3. Brief analysis (2-3 sentences)
4. 3 actionable recommendations
5. Predicted completion date based on current savings rate

Format your response as JSON with this structure:
{
  "creditScore": number (0-100),
  "scoreCategory": "Excellent" | "Good" | "Fair" | "Poor",
  "riskLevel": "Low" | "Medium" | "High",
  "analysis": "string",
  "recommendations": ["string", "string", "string"],
  "predictedCompletionDate": "YYYY-MM-DD",
  "onTrack": boolean,
  "confidence": number (0-100)
}
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor AI specializing in personal savings and goal achievement. Provide practical, encouraging, and data-driven insights. Always respond with valid JSON only, no additional text."
        },
        {
          role: "user",
          content: context
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    })

    const aiResponse = completion.choices[0].message.content
    if (!aiResponse) {
      console.warn('No response from OpenAI for goal:', goalId)
      return null
    }

    const analysis = JSON.parse(aiResponse)

    // Save analysis to database
    try {
      await prisma.aIGoalAnalysis.create({
        data: {
          savingsGoalId: goalId,
          creditScore: analysis.creditScore,
          scoreCategory: analysis.scoreCategory,
          riskLevel: analysis.riskLevel,
          analysis: analysis.analysis,
          recommendations: analysis.recommendations,
          predictedCompletionDate: new Date(analysis.predictedCompletionDate),
          onTrack: analysis.onTrack,
          confidence: analysis.confidence,
          progressPercentage: progressPercentage,
          avgMonthlyContribution: avgMonthlyContribution,
          requiredMonthlyContribution: requiredMonthlyContribution,
          daysUntilDeadline: daysUntilDeadline,
          remainingAmount: remainingAmount,
        }
      })
      console.log(`✓ AI analysis saved to database for goal ${goalId}`)
    } catch (dbError) {
      console.error(`✗ Failed to save AI analysis to database:`, dbError)
    }

    // Return the complete analysis with metrics
    return {
      ...analysis,
      metrics: {
        progressPercentage: progressPercentage.toFixed(1),
        avgMonthlyContribution: avgMonthlyContribution.toFixed(2),
        requiredMonthlyContribution: requiredMonthlyContribution.toFixed(2),
        daysUntilDeadline,
        remainingAmount,
      }
    }

  } catch (error) {
    console.error("AI analysis generation error:", error)
    return null
  }
}

// Trigger AI analysis in the background (non-blocking)
export function triggerBackgroundAnalysis(goalId: string) {
  // Run analysis asynchronously without blocking the main request
  generateAIAnalysis(goalId)
    .then(analysis => {
      if (analysis) {
        console.log(`✓ AI analysis completed for goal ${goalId}: Score ${analysis.creditScore}`)
      }
    })
    .catch(error => {
      console.error(`✗ Background AI analysis failed for goal ${goalId}:`, error)
    })
}

