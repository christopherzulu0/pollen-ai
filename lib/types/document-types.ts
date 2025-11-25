// Document processing types

export type DocumentType =
    | 'nrcFront'
    | 'nrcBack'
    | 'payslip'
    | 'utilityBill'
    | 'landOwnership'
    | 'vendorQuotation'
    | 'subsidyReceipt'
    | 'proofOfAddress'
    | 'liveSelfie'
    | 'bankStatement'

export type DocumentQuality = 'good' | 'fair' | 'poor'

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error'

// Base extracted data interface
export interface BaseExtractedData {
    documentQuality: DocumentQuality
    isValid: boolean
    confidence: number
}

// NRC Front extracted data
export interface NRCFrontData extends BaseExtractedData {
    nrcNumber: string | null
    fullName: string | null
    dateOfBirth: string | null
    sex: string | null
    placeOfBirth: string | null
}

// NRC Back extracted data
export interface NRCBackData extends BaseExtractedData {
    address: string | null
    issueDate: string | null
    expiryDate: string | null
}

// Payslip extracted data
export interface PayslipData extends BaseExtractedData {
    employerName: string | null
    employeeName: string | null
    monthlyGrossSalary: number | null
    monthlyNetSalary: number | null
    payPeriod: string | null
    employeeId: string | null
    position: string | null
}

// Utility Bill extracted data
export interface UtilityBillData extends BaseExtractedData {
    accountHolderName: string | null
    serviceAddress: string | null
    billDate: string | null
    utilityType: string | null
    accountNumber: string | null
}

// Land Ownership extracted data
export interface LandOwnershipData extends BaseExtractedData {
    ownerName: string | null
    propertyAddress: string | null
    plotNumber: string | null
    landSize: string | null
    documentType: string | null
}

// Vendor Quotation extracted data
export interface VendorQuotationData extends BaseExtractedData {
    vendorName: string | null
    quotationNumber: string | null
    quotationDate: string | null
    totalAmount: number | null
    itemDescription: string | null
    validityPeriod: string | null
}

// Subsidy Receipt extracted data
export interface SubsidyReceiptData extends BaseExtractedData {
    recipientName: string | null
    subsidyAmount: number | null
    subsidyType: string | null
    receiptDate: string | null
    receiptNumber: string | null
    issuingAuthority: string | null
}

// Proof of Address extracted data
export interface ProofOfAddressData extends BaseExtractedData {
    name: string | null
    address: string | null
    documentType: string | null
    documentDate: string | null
}

// Live Selfie assessment data
export interface LiveSelfieData {
    faceDetected: boolean
    imageQuality: DocumentQuality
    isLive: string
    confidence: number
}

// Union type for all extracted data
export type ExtractedDocumentData =
    | NRCFrontData
    | NRCBackData
    | PayslipData
    | UtilityBillData
    | LandOwnershipData
    | VendorQuotationData
    | SubsidyReceiptData
    | ProofOfAddressData
    | LiveSelfieData

// API Request/Response types
export interface ProcessDocumentRequest {
    documentUrl: string
    documentType: DocumentType
}

export interface ProcessDocumentResponse {
    success: boolean
    data?: ExtractedDocumentData
    error?: string
    rawResponse?: string
}

// Document verification status
export interface DocumentVerificationStatus {
    documentType: DocumentType
    status: ProcessingStatus
    extractedData?: ExtractedDocumentData
    error?: string
    processedAt?: string
}

// Auto-fill data structure
export interface AutoFillData {
    // From NRC
    fullName?: string
    dateOfBirth?: string
    address?: string
    nrcNumber?: string

    // From Payslip
    employmentStatus?: string
    monthlyIncome?: number
    employerName?: string

    // Confidence scores
    confidence?: {
        nrc?: number
        payslip?: number
        address?: number
    }
}

// NRC Verification
export interface NRCVerificationResult {
    match: boolean
    confidence: number
    reason: string
}

export interface NRCVerificationResponse {
    success: boolean
    data?: NRCVerificationResult
    error?: string
}

// Sentiment Analysis Types

export type SentimentType = 'positive' | 'negative' | 'neutral' | 'mixed'

export type SentimentIntensity = 'low' | 'medium' | 'high'

export interface CommentSentiment {
    sentiment: SentimentType
    score: number // -1 to 1 scale
    confidence: number // 0-100
    emotions: string[]
    keywords: string[]
    intensity: SentimentIntensity
}

export interface FeedbackInsights {
    themes: string[]
    suggestions: string[]
    complaints: string[]
    praise: string[]
    topKeywords: string[]
    summary: string
}

export interface SatisfactionMetrics {
    overallScore: number // 0-100
    positivePercentage: number
    negativePercentage: number
    neutralPercentage: number
    totalComments: number
    averageSentiment: number
}

export interface SentimentAnalysisRequest {
    comment: string
}

export interface SentimentAnalysisResponse {
    success: boolean
    data?: CommentSentiment
    error?: string
}

export interface BatchSentimentRequest {
    comments: Array<{ id: string; text: string }>
}

export interface BatchSentimentResponse {
    success: boolean
    data?: Array<{ id: string; sentiment: SentimentType; score: number; confidence: number; emotions: string[] }>
    error?: string
}
