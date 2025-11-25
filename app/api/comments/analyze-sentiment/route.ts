import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzeCommentSentiment, analyzeBatchCommentsSentiment } from '@/lib/openai'
import { SentimentAnalysisRequest, BatchSentimentRequest } from '@/lib/types/document-types'

/**
 * POST /api/comments/analyze-sentiment
 * Analyze sentiment of a single comment
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body: SentimentAnalysisRequest = await request.json()
        const { comment } = body

        // Validate request
        if (!comment || comment.trim().length === 0) {
            return NextResponse.json(
                { error: 'Comment text is required' },
                { status: 400 }
            )
        }

        // Analyze sentiment with OpenAI
        const result = await analyzeCommentSentiment(comment)

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to analyze sentiment',
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            analyzedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Error analyzing comment sentiment:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze sentiment',
            },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/comments/analyze-sentiment
 * Analyze sentiment of multiple comments in batch
 */
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body: BatchSentimentRequest = await request.json()
        const { comments } = body

        // Validate request
        if (!comments || !Array.isArray(comments) || comments.length === 0) {
            return NextResponse.json(
                { error: 'Comments array is required and must not be empty' },
                { status: 400 }
            )
        }

        // Validate each comment has id and text
        const invalidComments = comments.filter(c => !c.id || !c.text)
        if (invalidComments.length > 0) {
            return NextResponse.json(
                { error: 'Each comment must have an id and text field' },
                { status: 400 }
            )
        }

        // Analyze batch with OpenAI
        const result = await analyzeBatchCommentsSentiment(comments)

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to analyze batch sentiments',
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            analyzedAt: new Date().toISOString(),
            totalAnalyzed: result.data?.length || 0,
        })
    } catch (error) {
        console.error('Error analyzing batch sentiments:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze batch sentiments',
            },
            { status: 500 }
        )
    }
}
