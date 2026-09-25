import OpenAI from 'openai'

// Initialize OpenAI client
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Analyze a document image using GPT-4 Vision
 * @param imageUrl - URL of the document image
 * @param documentType - Type of document being analyzed
 * @returns Extracted data from the document
 */
export async function analyzeDocument(
    imageUrl: string,
    documentType: 'nrcFront' | 'nrcBack' | 'payslip' | 'utilityBill' | 'landOwnership' | 'vendorQuotation' | 'subsidyReceipt' | 'proofOfAddress' | 'liveSelfie' | 'bankStatement'
) {
    try {
        const prompts: Record<
            | 'nrcFront'
            | 'nrcBack'
            | 'payslip'
            | 'utilityBill'
            | 'landOwnership'
            | 'vendorQuotation'
            | 'subsidyReceipt'
            | 'proofOfAddress'
            | 'liveSelfie'
            | 'bankStatement',
            string
        > = {
            nrcFront: `Analyze this Zambian National Registration Card (NRC) front image and extract the following information in JSON format:
{
  "nrcNumber": "NRC number",
  "fullName": "Full name as shown",
  "dateOfBirth": "Date of birth (YYYY-MM-DD format)",
  "sex": "Gender",
  "placeOfBirth": "Place of birth",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null. Assess document quality and validity.`,

            nrcBack: `Analyze this Zambian National Registration Card (NRC) back image and extract the following information in JSON format:
{
  "address": "Full residential address",
  "issueDate": "Date of issue (YYYY-MM-DD format)",
  "expiryDate": "Expiry date if shown (YYYY-MM-DD format)",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,

            payslip: `Analyze this payslip/salary document and extract the following information in JSON format:
{
  "employerName": "Employer/company name",
  "employeeName": "Employee name",
  "monthlyGrossSalary": "Gross salary amount (number only)",
  "monthlyNetSalary": "Net salary amount (number only)",
  "payPeriod": "Pay period (e.g., 'November 2024')",
  "employeeId": "Employee ID if visible",
  "position": "Job position/title if visible",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
Extract only numeric values for salary fields. If any field is not clearly visible, use null.`,

            utilityBill: `Analyze this utility bill and extract the following information in JSON format:
{
  "accountHolderName": "Account holder name",
  "serviceAddress": "Service address",
  "billDate": "Bill date (YYYY-MM-DD format)",
  "utilityType": "Type of utility (electricity/water/etc)",
  "accountNumber": "Account number if visible",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,

            landOwnership: `Analyze this land ownership document and extract the following information in JSON format:
{
  "ownerName": "Property owner name",
  "propertyAddress": "Property address/location",
  "plotNumber": "Plot/parcel number if visible",
  "landSize": "Land size if visible",
  "documentType": "Type of document (title deed/certificate/etc)",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,

            vendorQuotation: `Analyze this vendor quotation document and extract the following information in JSON format:
{
  "vendorName": "Vendor/supplier name",
  "quotationNumber": "Quotation number",
  "quotationDate": "Quotation date (YYYY-MM-DD format)",
  "totalAmount": "Total amount (number only)",
  "itemDescription": "Main items/services quoted",
  "validityPeriod": "Quotation validity period if shown",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,

            subsidyReceipt: `Analyze this subsidy receipt document and extract the following information in JSON format:
{
  "recipientName": "Recipient name",
  "subsidyAmount": "Subsidy amount (number only)",
  "subsidyType": "Type of subsidy",
  "receiptDate": "Receipt date (YYYY-MM-DD format)",
  "receiptNumber": "Receipt number if visible",
  "issuingAuthority": "Issuing authority/organization",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,

            proofOfAddress: `Analyze this proof of address document and extract the following information in JSON format:
{
  "name": "Name on document",
  "address": "Full address",
  "documentType": "Type of document",
  "documentDate": "Document date (YYYY-MM-DD format)",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,

            liveSelfie: `Analyze this selfie image and provide the following assessment in JSON format:
{
  "faceDetected": true/false,
  "imageQuality": "good/fair/poor",
  "isLive": "Assessment if this appears to be a live photo (not a photo of a photo)",
  "confidence": 0-100
}
Assess if this appears to be a genuine live selfie.`,

            bankStatement: `Analyze this bank statement and extract the following information in JSON format:
{
  "accountHolderName": "Name on the account",
  "accountNumber": "Last 4 digits only",
  "bankName": "Name of the bank",
  "statementPeriod": "Statement period (e.g., January 2024)",
  "averageBalance": "Average monthly balance",
  "documentQuality": "good/fair/poor",
  "isValid": true/false,
  "confidence": 0-100
}
If any field is not clearly visible, use null.`,
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompts[documentType],
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
            temperature: 0.1, // Low temperature for more consistent extraction
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error('No response from OpenAI')
        }

        // Parse JSON response
        try {
            // Try to extract JSON from markdown code blocks or raw JSON
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/)

            if (!jsonMatch) {
                // OpenAI returned a text response instead of JSON
                console.error('OpenAI returned non-JSON response:', content)
                throw new Error(`Unable to process document: ${content.substring(0, 200)}`)
            }

            const jsonString = jsonMatch[1]

            try {
                const extractedData = JSON.parse(jsonString)

                return {
                    success: true,
                    data: extractedData,
                    rawResponse: content,
                }
            } catch (parseError) {
                console.error('Failed to parse extracted JSON:', jsonString)
                throw new Error('Unable to extract valid data from document. Please ensure the document is clear and readable.')
            }
        } catch (parseError) {
            console.error('Failed to process OpenAI response:', parseError)

            // Return the actual error message instead of generic one
            let errorMessage = 'Failed to parse document data'

            if (parseError instanceof Error) {
                // Extract the OpenAI message if it's our custom error
                if (parseError.message.includes('Unable to process document:')) {
                    errorMessage = parseError.message.replace('Unable to process document: ', '')
                } else if (parseError.message.includes('Unable to extract valid data')) {
                    errorMessage = parseError.message
                } else {
                    errorMessage = `Unable to process document: ${parseError.message}`
                }
            }

            return {
                success: false,
                error: errorMessage,
                rawResponse: content,
            }
        }
    } catch (error) {
        console.error('Error analyzing document:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Verify if two NRC images match (front and back belong to same person)
 */
export async function verifyNRCMatch(nrcFrontUrl: string, nrcBackUrl: string) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Compare these two NRC images (front and back). Verify if they appear to be from the same document and belong to the same person. Return a JSON response:
{
  "match": true/false,
  "confidence": 0-100,
  "reason": "Brief explanation"
}`,
                        },
                        {
                            type: 'image_url',
                            image_url: { url: nrcFrontUrl },
                        },
                        {
                            type: 'image_url',
                            image_url: { url: nrcBackUrl },
                        },
                    ],
                },
            ],
            max_tokens: 300,
            temperature: 0.1,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error('No response from OpenAI')
        }

        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/)
        const jsonString = jsonMatch ? jsonMatch[1] : content
        const result = JSON.parse(jsonString)

        return {
            success: true,
            data: result,
        }
    } catch (error) {
        console.error('Error verifying NRC match:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Analyze sentiment of a single comment
 * @param comment - The comment text to analyze
 * @returns Sentiment analysis results
 */
export async function analyzeCommentSentiment(comment: string) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Using mini for cost efficiency on text-only tasks
            messages: [
                {
                    role: 'system',
                    content: `You are a sentiment analysis expert. Analyze the sentiment of user comments and provide detailed emotional insights.
Your analysis should be objective, nuanced, and consider context.`,
                },
                {
                    role: 'user',
                    content: `Analyze the sentiment of this comment and return a JSON response:

Comment: "${comment}"

Return JSON in this exact format:
{
  "sentiment": "positive" | "negative" | "neutral" | "mixed",
  "score": number between -1 (very negative) and 1 (very positive),
  "confidence": number between 0-100,
  "emotions": ["array", "of", "detected", "emotions"],
  "keywords": ["key", "words", "or", "phrases"],
  "intensity": "low" | "medium" | "high"
}`,
                },
            ],
            max_tokens: 500,
            temperature: 0.3,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error('No response from OpenAI')
        }

        // Parse JSON response
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/)
        const jsonString = jsonMatch ? jsonMatch[1] : content
        const sentimentData = JSON.parse(jsonString)

        return {
            success: true,
            data: sentimentData,
        }
    } catch (error) {
        console.error('Error analyzing comment sentiment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Analyze sentiment of multiple comments in batch
 * @param comments - Array of comment objects with id and text
 * @returns Batch sentiment analysis results
 */
export async function analyzeBatchCommentsSentiment(
    comments: Array<{ id: string; text: string }>
) {
    try {
        // Limit batch size to avoid token limits
        const batchSize = 10
        const batches = []

        for (let i = 0; i < comments.length; i += batchSize) {
            batches.push(comments.slice(i, i + batchSize))
        }

        const results: any[] = []

        for (const batch of batches) {
            const commentsText = batch.map((c, idx) => `${idx + 1}. "${c.text}"`).join('\n')

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a sentiment analysis expert. Analyze multiple comments efficiently and provide sentiment data for each.',
                    },
                    {
                        role: 'user',
                        content: `Analyze the sentiment of these comments and return a JSON array with one entry per comment:

Comments:
${commentsText}

Return JSON array in this format:
[
  {
    "index": 1,
    "sentiment": "positive" | "negative" | "neutral" | "mixed",
    "score": number between -1 and 1,
    "confidence": number between 0-100,
    "emotions": ["array", "of", "emotions"]
  },
  ...
]`,
                    },
                ],
                max_tokens: 2000,
                temperature: 0.3,
            })

            const content = response.choices[0]?.message?.content
            if (!content) {
                throw new Error('No response from OpenAI')
            }

            const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/) || content.match(/(\[[\s\S]*\])/)
            const jsonString = jsonMatch ? jsonMatch[1] : content
            const batchResults = JSON.parse(jsonString)

            // Map results back to comment IDs
            batchResults.forEach((result: any, idx: number) => {
                if (batch[idx]) {
                    results.push({
                        id: batch[idx].id,
                        ...result,
                    })
                }
            })
        }

        return {
            success: true,
            data: results,
        }
    } catch (error) {
        console.error('Error analyzing batch comments:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Extract feedback insights from multiple comments
 * @param comments - Array of comment texts
 * @returns Extracted themes, suggestions, complaints, and praise
 */
export async function extractFeedbackInsights(comments: string[]) {
    try {
        const commentsText = comments.slice(0, 50).join('\n---\n') // Limit to 50 comments

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a customer feedback analyst. Extract key insights from user comments including themes, suggestions, complaints, and praise.
Be concise and actionable in your analysis.`,
                },
                {
                    role: 'user',
                    content: `Analyze these user comments and extract key insights:

Comments:
${commentsText}

Return JSON in this format:
{
  "themes": ["array", "of", "common", "themes"],
  "suggestions": ["array", "of", "user", "suggestions"],
  "complaints": ["array", "of", "complaints"],
  "praise": ["array", "of", "positive", "feedback"],
  "topKeywords": ["most", "frequent", "keywords"],
  "summary": "Brief overall summary of feedback"
}`,
                },
            ],
            max_tokens: 1000,
            temperature: 0.4,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error('No response from OpenAI')
        }

        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/)
        const jsonString = jsonMatch ? jsonMatch[1] : content
        const insights = JSON.parse(jsonString)

        return {
            success: true,
            data: insights,
        }
    } catch (error) {
        console.error('Error extracting feedback insights:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Calculate overall satisfaction score from sentiment data
 * @param sentiments - Array of sentiment scores (-1 to 1)
 * @returns Satisfaction metrics
 */
export function calculateSatisfactionScore(
    sentiments: Array<{ sentiment: string; score: number }>
) {
    if (sentiments.length === 0) {
        return {
            overallScore: 0,
            positivePercentage: 0,
            negativePercentage: 0,
            neutralPercentage: 0,
            totalComments: 0,
            averageSentiment: 0,
        }
    }

    const totalComments = sentiments.length
    const positiveCount = sentiments.filter((s) => s.sentiment === 'positive').length
    const negativeCount = sentiments.filter((s) => s.sentiment === 'negative').length
    const neutralCount = sentiments.filter((s) => s.sentiment === 'neutral').length

    const averageSentiment =
        sentiments.reduce((sum, s) => sum + s.score, 0) / totalComments

    // Convert average sentiment (-1 to 1) to satisfaction score (0 to 100)
    const overallScore = Math.round(((averageSentiment + 1) / 2) * 100)

    return {
        overallScore,
        positivePercentage: Math.round((positiveCount / totalComments) * 100),
        negativePercentage: Math.round((negativeCount / totalComments) * 100),
        neutralPercentage: Math.round((neutralCount / totalComments) * 100),
        totalComments,
        averageSentiment: Math.round(averageSentiment * 100) / 100,
    }
}

