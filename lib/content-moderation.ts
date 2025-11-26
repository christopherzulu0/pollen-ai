import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Content Moderation Result Interface
 */
export interface ModerationResult {
    success: boolean
    isAppropriate: boolean
    isSafe: boolean
    isSpam: boolean
    flaggedCategories: string[]
    confidence: number
    reason?: string
    suggestions?: string
    error?: string
}

/**
 * Moderate comment content using OpenAI Moderation API and GPT analysis
 * Checks for:
 * - Inappropriate content
 * - Spam
 * - Harmful content
 * - Offensive language
 */
export async function moderateComment(content: string): Promise<ModerationResult> {
    try {
        // Step 1: Use OpenAI Moderation API for initial screening
        const moderationResponse = await openai.moderations.create({
            input: content,
        })

        const moderation = moderationResponse.results[0]
        const flaggedCategories: string[] = []

        // Check all moderation categories
        if (moderation.categories.hate) flaggedCategories.push('hate')
        if (moderation.categories['hate/threatening']) flaggedCategories.push('hate/threatening')
        if (moderation.categories.harassment) flaggedCategories.push('harassment')
        if (moderation.categories['harassment/threatening']) flaggedCategories.push('harassment/threatening')
        if (moderation.categories['self-harm']) flaggedCategories.push('self-harm')
        if (moderation.categories['self-harm/intent']) flaggedCategories.push('self-harm/intent')
        if (moderation.categories['self-harm/instructions']) flaggedCategories.push('self-harm/instructions')
        if (moderation.categories.sexual) flaggedCategories.push('sexual')
        if (moderation.categories['sexual/minors']) flaggedCategories.push('sexual/minors')
        if (moderation.categories.violence) flaggedCategories.push('violence')
        if (moderation.categories['violence/graphic']) flaggedCategories.push('violence/graphic')

        // If flagged by moderation API, reject immediately
        if (moderation.flagged) {
            return {
                success: true,
                isAppropriate: false,
                isSafe: false,
                isSpam: false,
                flaggedCategories,
                confidence: 95,
                reason: `Content violates community guidelines: ${flaggedCategories.join(', ')}`,
            }
        }

        // Step 2: Use GPT for spam detection and context analysis
        const analysisResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a content moderator for a financial services blog. Analyze comments for:
1. Spam (promotional content, repetitive messages, irrelevant links)
2. Inappropriate content (offensive language, personal attacks)
3. Off-topic content
4. Suspicious patterns

Respond in JSON format:
{
  "isSpam": true/false,
  "isAppropriate": true/false,
  "confidence": 0-100,
  "reason": "Brief explanation",
  "suggestions": "How to improve if inappropriate"
}`,
                },
                {
                    role: 'user',
                    content: `Analyze this comment: "${content}"`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const analysisContent = analysisResponse.choices[0]?.message?.content
        if (!analysisContent) {
            throw new Error('No analysis response from OpenAI')
        }

        const analysis = JSON.parse(analysisContent)

        // Combine results
        const isSafe = !moderation.flagged
        const isAppropriate = analysis.isAppropriate && isSafe
        const isSpam = analysis.isSpam

        return {
            success: true,
            isAppropriate,
            isSafe,
            isSpam,
            flaggedCategories,
            confidence: analysis.confidence || 80,
            reason: analysis.reason,
            suggestions: analysis.suggestions,
        }
    } catch (error) {
        console.error('Error moderating comment:', error)
        return {
            success: false,
            isAppropriate: true, // Default to allowing if moderation fails
            isSafe: true,
            isSpam: false,
            flaggedCategories: [],
            confidence: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
