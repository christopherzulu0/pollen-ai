import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzeDocument, verifyNRCMatch } from '@/lib/openai'
import { DocumentType, ProcessDocumentRequest } from '@/lib/types/document-types'

/**
 * POST /api/process-document
 * Process and extract data from uploaded documents using OpenAI Vision API
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body: ProcessDocumentRequest = await request.json()
        const { documentUrl, documentType } = body

        // Validate request
        if (!documentUrl || !documentType) {
            return NextResponse.json(
                { error: 'Missing required fields: documentUrl and documentType' },
                { status: 400 }
            )
        }

        // Validate document type
        const validDocumentTypes: DocumentType[] = [
            'nrcFront',
            'nrcBack',
            'payslip',
            'utilityBill',
            'landOwnership',
            'vendorQuotation',
            'subsidyReceipt',
            'proofOfAddress',
            'liveSelfie',
            'bankStatement',
        ]

        if (!validDocumentTypes.includes(documentType)) {
            return NextResponse.json(
                { error: `Invalid document type. Must be one of: ${validDocumentTypes.join(', ')}` },
                { status: 400 }
            )
        }

        // Process document with OpenAI
        const result = await analyzeDocument(documentUrl, documentType)

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to process document',
                },
                { status: 500 }
            )
        }

        // Return extracted data
        return NextResponse.json({
            success: true,
            documentType,
            data: result.data,
            processedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Error processing document:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process document',
            },
            { status: 500 }
        )
    }
}

/**
 * POST /api/process-document/verify-nrc
 * Verify that NRC front and back images match
 */
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { nrcFrontUrl, nrcBackUrl } = body

        // Validate request
        if (!nrcFrontUrl || !nrcBackUrl) {
            return NextResponse.json(
                { error: 'Missing required fields: nrcFrontUrl and nrcBackUrl' },
                { status: 400 }
            )
        }

        // Verify NRC match
        const result = await verifyNRCMatch(nrcFrontUrl, nrcBackUrl)

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to verify NRC documents',
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            verification: result.data,
            verifiedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Error verifying NRC:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to verify NRC documents',
            },
            { status: 500 }
        )
    }
}
