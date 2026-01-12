"use client"

import React, { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
    ArrowLeft,
    Check,
    Loader2,
    AlertCircle,
    DollarSign,
    Calendar,
    FileText,
    User,
    Phone,
    Mail,
    MapPin,
    Building,
    CreditCard,
    Upload,
    X,
    Info,
    TrendingUp,
    Shield,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Calculator,
    Brain,
    Zap,
    Eye,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { toast } from "sonner"
import { UploadButton } from "@/utils/uploadthing"
import { DocumentType, DocumentVerificationStatus, ProcessingStatus, AutoFillData, ExtractedDocumentData, NRCFrontData, NRCBackData, PayslipData } from "@/lib/types/document-types"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Service interface
interface Service {
    id: string
    name: string
    nameKey?: string | null
    description: string
    category: string
    status: "active" | "inactive"
    icon?: string | null
    image?: string | null
    users?: number | null
    revenue?: number | null
    growth?: number | null
    keyFeatures?: string[]
    requirements?: string[]
}

// Group interface
interface Group {
    id: string
    name: string
    description?: string | null
    logo?: string | null
    contributionAmount: number
    contributionFrequency: string
    status: string
    memberships: Array<{
        id: string
        userId: string
        role: string
        status: string
    }>
    owner: {
        id: string
        name: string | null
        email: string
        avatar: string | null
    }
}

// Form schema - conditional based on service type
const createApplicationFormSchema = (serviceName: string, serviceCategory: string) => {
    const isVillageBanking = serviceCategory === "Village Banking" || serviceName.toLowerCase().includes("village banking")

    // Base schema for all loans
    const baseLoanSchema = {
        // Loan Details
        amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        }),
        purpose: z.string().min(20, "Purpose must be at least 20 characters"),
        repaymentPeriod: z.string().min(1, "Please select a repayment period"),
    }

    // For Village Banking - only loan details and groupId
    if (isVillageBanking) {
        return z.object({
            ...baseLoanSchema,
            groupId: z.string().min(1, "Please select a group"),
        })
    }

    // For Individual Loans (Personal or Solar) - include employment info
    const individualLoanSchema = {
        ...baseLoanSchema,
        // Additional Information
        employmentStatus: z.string().min(1, "Please select employment status"),
        monthlyIncome: z.string().optional(),
        businessDetails: z.string().optional(),
    }

    // Add document fields for Personal Loans
    if (serviceName === "Personal Loans") {
        return z.object({
            ...individualLoanSchema,
            nrcFront: z.string().optional(),
            nrcBack: z.string().optional(),
            payslip: z.string().optional(),
            proofOfAddress: z.string().optional(),
            liveSelfie: z.string().optional(),
            bankStatement: z.string().optional(),
        })
    }

    // Add document fields for Solar Equipment
    if (serviceName === "Solar Equipment" || serviceName.toLowerCase().includes("solar")) {
        return z.object({
            ...individualLoanSchema,
            nrcFront: z.string().optional(),
            nrcBack: z.string().optional(),
            landOwnership: z.string().optional(),
            utilityBill: z.string().optional(),
            vendorQuotation: z.string().optional(),
            subsidyReceipt: z.string().optional(),
        })
    }

    return z.object(individualLoanSchema)
}

type ApplicationFormValues = z.infer<ReturnType<typeof createApplicationFormSchema>>

// Fetch single service
async function fetchService(serviceId: string): Promise<Service> {
    const response = await fetch(`/api/services`)
    if (!response.ok) {
        throw new Error("Failed to fetch service")
    }
    const services = await response.json()
    const service = services.find((s: Service) => s.id === serviceId)
    if (!service) {
        throw new Error("Service not found")
    }
    return service
}

// Helper function to get icon
function getServiceIcon(category: string, iconName?: string | null, className = "h-8 w-8 text-[#00CC66] dark:text-emerald-400") {
    if (iconName && iconName.trim()) {
        const trimmedIconName = iconName.trim()
        let IconComponent = (LucideIcons as any)[trimmedIconName]

        if (!IconComponent) {
            const iconNames = Object.keys(LucideIcons).filter(
                (name) =>
                    name[0] === name[0].toUpperCase() &&
                    !name.startsWith("Icon") &&
                    !name.startsWith("Lucide")
            )
            const matchedIcon = iconNames.find(
                (name) => name.toLowerCase() === trimmedIconName.toLowerCase()
            )
            if (matchedIcon) {
                IconComponent = (LucideIcons as any)[matchedIcon]
            }
        }

        if (IconComponent) {
            return <IconComponent className={className} />
        }
    }

    // Fallback icons
    const icons: Record<string, React.ReactNode> = {
        "Digital Loans": <CreditCard className={className} />,
        "Village Banking": <Building className={className} />,
        "Irrigation Loans": <DollarSign className={className} />,
    }
    return icons[category] || <DollarSign className={className} />
}

// Loan Calculator Component
function LoanCalculator({ service, amount, period }: { service: Service; amount: string; period: string }) {
    const loanAmount = Number(amount) || 0
    const months = Number(period) || 12

    // Determine interest rate based on service type
    const isSolarEquipment = service.name === "Solar Equipment" || service.name.toLowerCase().includes("solar")
    const isPersonalLoan = service.name === "Personal Loans" || service.name === "Personal Loans "

    // Interest rates: Solar 20%, Personal 10%
    const interestRate = isSolarEquipment ? 0.20 : isPersonalLoan ? 0.10 : 0.10 // Default to 10% if unknown
    const interestRatePercent = (interestRate * 100).toFixed(0)

    const monthlyRate = interestRate / 12
    const monthlyPayment = loanAmount > 0 && months > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
        : 0

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - loanAmount

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                <h4 className="font-semibold text-primary dark:text-white">Loan Calculation</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-linear-to-br from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-primary/10 dark:border-blue-800/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Payment</p>
                    <p className="text-xl font-bold text-primary dark:text-white">
                        K{monthlyPayment.toFixed(2)}
                    </p>
                </div>

                <div className="bg-linear-to-br from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-primary/10 dark:border-blue-800/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Interest</p>
                    <p className="text-xl font-bold text-primary dark:text-white">
                        K{totalInterest.toFixed(2)}
                    </p>
                </div>

                <div className="col-span-2 bg-linear-to-br from-[#00CC66]/10 to-primary/5 dark:from-emerald-900/30 dark:to-blue-900/20 p-4 rounded-lg border border-[#00CC66]/20 dark:border-emerald-800/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Repayment</p>
                    <p className="text-2xl font-bold text-primary dark:text-white">
                        K{totalPayment.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Over {months} months at {interestRatePercent}% APR
                    </p>
                </div>
            </div>
        </div>
    )
}

// Eligibility Checker Component
function EligibilityChecker({ service, formData }: { service: Service; formData: Partial<ApplicationFormValues> }) {
    const [eligibilityScore, setEligibilityScore] = useState(0)
    const [checks, setChecks] = useState<Array<{ label: string; passed: boolean; message: string }>>([])

    const isVillageBanking = service.category === "Village Banking" || service.name.toLowerCase().includes("village banking")

    useEffect(() => {
        const newChecks = []
        let score = 0

        if (isVillageBanking) {
            // For Village Banking - check group selection and loan details
            // Check 1: Group selection
            if ('groupId' in formData && formData.groupId) {
                newChecks.push({ label: "Group Selection", passed: true, message: "Group selected" })
                score += 50
            } else {
                newChecks.push({ label: "Group Selection", passed: false, message: "Please select a group" })
            }

            // Check 2: Loan purpose clarity
            if (formData.purpose && formData.purpose.length >= 20) {
                newChecks.push({ label: "Loan Purpose", passed: true, message: "Clear loan purpose stated" })
                score += 50
            } else {
                newChecks.push({ label: "Loan Purpose", passed: false, message: "Detailed loan purpose required" })
            }
        } else {
            // For Individual Loans - check employment and income
            // Check 1: Employment status
            if ('employmentStatus' in formData && formData.employmentStatus) {
                newChecks.push({ label: "Employment", passed: true, message: "Employment status confirmed" })
                score += 30
            } else {
                newChecks.push({ label: "Employment", passed: false, message: "Employment status required" })
            }

            // Check 2: Income verification
            if ('monthlyIncome' in formData && formData.monthlyIncome && Number(formData.monthlyIncome) > 0) {
                newChecks.push({ label: "Income", passed: true, message: "Income information provided" })
                score += 30
            } else {
                newChecks.push({ label: "Income", passed: false, message: "Income verification needed" })
            }

            // Check 3: Loan purpose clarity
            if (formData.purpose && formData.purpose.length >= 20) {
                newChecks.push({ label: "Loan Purpose", passed: true, message: "Clear loan purpose stated" })
                score += 40
            } else {
                newChecks.push({ label: "Loan Purpose", passed: false, message: "Detailed loan purpose required" })
            }
        }

        setChecks(newChecks)
        setEligibilityScore(score)
    }, [formData, isVillageBanking])

    const getScoreColor = () => {
        if (eligibilityScore >= 80) return "text-green-600 dark:text-green-400"
        if (eligibilityScore >= 60) return "text-yellow-600 dark:text-yellow-400"
        return "text-red-600 dark:text-red-400"
    }

    const getScoreLabel = () => {
        if (eligibilityScore >= 80) return "Excellent"
        if (eligibilityScore >= 60) return "Good"
        if (eligibilityScore >= 40) return "Fair"
        return "Needs Improvement"
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                    <h4 className="font-semibold text-primary dark:text-white">Eligibility Score</h4>
                </div>
                <Badge className={`${getScoreColor()} bg-transparent border`}>
                    {getScoreLabel()}
                </Badge>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Your Score</span>
                    <span className={`font-bold ${getScoreColor()}`}>{eligibilityScore}%</span>
                </div>
                <Progress value={eligibilityScore} className="h-3" />
            </div>

            <div className="space-y-2 mt-4">
                {checks.map((check, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                    >
                        {check.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                        ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{check.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{check.message}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Application Form Component
function ApplicationForm({ service }: { service: Service }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formProgress, setFormProgress] = useState(0)
    const [activeTab, setActiveTab] = useState("form")
    const [uploadedFiles, setUploadedFiles] = useState<{
        nrcFront?: { name: string, url: string, size: number }
        nrcBack?: { name: string, url: string, size: number }
        payslip?: { name: string, url: string, size: number }
        proofOfAddress?: { name: string, url: string, size: number }
        liveSelfie?: { name: string, url: string, size: number }
        bankStatement?: { name: string, url: string, size: number }
        landOwnership?: { name: string, url: string, size: number }
        utilityBill?: { name: string, url: string, size: number }
        vendorQuotation?: { name: string, url: string, size: number }
        subsidyReceipt?: { name: string, url: string, size: number }
    }>({})
    const [hasExistingDocuments, setHasExistingDocuments] = useState(false)
    const [checkingDocuments, setCheckingDocuments] = useState(true)
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
    const [uploadingField, setUploadingField] = useState<string | null>(null)
    const [profileError, setProfileError] = useState<string | null>(null)

    // AI Processing State
    const [documentVerifications, setDocumentVerifications] = useState<Record<string, DocumentVerificationStatus>>({})
    const [autoFillData, setAutoFillData] = useState<AutoFillData | null>(null)
    const [showAutoFillDialog, setShowAutoFillDialog] = useState(false)
    const [aiProcessing, setAiProcessing] = useState<Record<string, boolean>>({})
    
    // Alert Dialog State
    const [alertDialogOpen, setAlertDialogOpen] = useState(false)
    const [alertDialogContent, setAlertDialogContent] = useState<{ title: string; description: string }>({
        title: "",
        description: ""
    })

    const isPersonalLoan = service.name === "Personal Loans" || service.name === "Personal Loans "
    const isSolarEquipment = service.name === "Solar Equipment" || service.name.toLowerCase().includes("solar")
    const isVillageBanking = service.category === "Village Banking" || service.name.toLowerCase().includes("village banking")

    // Fetch user's groups (only for Village Banking services)
    const { data: groups = [], isLoading: isLoadingGroups, error: groupsError } = useQuery<Group[]>({
        queryKey: ['user-groups'],
        queryFn: async () => {
            const response = await fetch('/api/groups')
            if (!response.ok) {
                throw new Error('Failed to fetch groups')
            }
            const data = await response.json()
            // Filter only active groups
            return data.filter((group: Group) => group.status === 'ACTIVE')
        },
        enabled: isVillageBanking, // Only fetch if it's a Village Banking service
        staleTime: 60000, // 1 minute,
    })

    // Check for existing documents on mount (for Personal Loans or Solar Equipment)
    useEffect(() => {
        if (isPersonalLoan || isSolarEquipment) {
            checkExistingDocuments()
        } else {
            setCheckingDocuments(false)
        }
    }, [isPersonalLoan, isSolarEquipment])

    const checkExistingDocuments = async () => {
        try {
            const serviceType = isSolarEquipment ? "Solar Equipment" : "Personal Loans"
            const response = await fetch(`/api/user-documents?serviceType=${encodeURIComponent(serviceType)}`)
            if (response.ok) {
                const data = await response.json()
                setHasExistingDocuments(data.hasDocuments)
            }
        } catch (error) {
            console.error('Error checking documents:', error)
        } finally {
            setCheckingDocuments(false)
        }
    }

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(createApplicationFormSchema(service.name, service.category)),
        defaultValues: {
            amount: "",
            purpose: "",
            repaymentPeriod: "",
            // Village Banking only needs groupId
            ...(isVillageBanking && {
                groupId: "",
            }),
            // Individual Loans need employment fields
            ...(!isVillageBanking && {
                employmentStatus: "",
                monthlyIncome: "",
                businessDetails: "",
            }),
            // Document fields for Personal Loans
            ...(isPersonalLoan && {
                nrcFront: "",
                nrcBack: "",
                payslip: "",
                proofOfAddress: "",
                liveSelfie: "",
                bankStatement: "",
            }),
            // Document fields for Solar Equipment
            ...(isSolarEquipment && {
                nrcFront: "",
                nrcBack: "",
                landOwnership: "",
                utilityBill: "",
                vendorQuotation: "",
                subsidyReceipt: "",
            }),
        },
        mode: "onChange",
    })

    // Process document with AI
    const processDocumentWithAI = async (documentUrl: string, documentType: DocumentType) => {
        try {
            setAiProcessing(prev => ({ ...prev, [documentType]: true }))
            setDocumentVerifications(prev => ({
                ...prev,
                [documentType]: {
                    documentType,
                    status: 'processing' as ProcessingStatus,
                }
            }))

            const response = await fetch('/api/process-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentUrl,
                    documentType,
                }),
            })

            const result = await response.json()

            if (result.success) {
                setDocumentVerifications(prev => ({
                    ...prev,
                    [documentType]: {
                        documentType,
                        status: 'success' as ProcessingStatus,
                        extractedData: result.data,
                        processedAt: result.processedAt,
                    }
                }))

                toast.success('Document processed successfully!', {
                    description: `AI extracted data from your ${documentType.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
                    icon: <Brain className="h-4 w-4" />,
                })

                // Auto-fill logic
                if (documentType === 'nrcFront' || documentType === 'nrcBack' || documentType === 'payslip') {
                    updateAutoFillData(documentType, result.data)
                }
            } else {
                setDocumentVerifications(prev => ({
                    ...prev,
                    [documentType]: {
                        documentType,
                        status: 'error' as ProcessingStatus,
                        error: result.error,
                    }
                }))

                // Remove the uploaded file since processing failed
                removeFile(documentType as any)

                // Show alert dialog for errors
                setAlertDialogContent({
                    title: 'Document Processing Failed',
                    description: result.error || 'Could not extract data from document. Please ensure you uploaded the correct document type.'
                })
                setAlertDialogOpen(true)
            }
        } catch (error) {
            console.error('Error processing document:', error)

            // Show alert dialog for errors
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while processing the document'
            setAlertDialogContent({
                title: 'Processing Error',
                description: errorMessage
            })
            setAlertDialogOpen(true)

            setDocumentVerifications(prev => ({
                ...prev,
                [documentType]: {
                    documentType,
                    status: 'error' as ProcessingStatus,
                    error: 'Failed to process document',
                }
            }))

            // Remove the uploaded file since processing failed
            removeFile(documentType as any)
        } finally {
            setAiProcessing(prev => ({ ...prev, [documentType]: false }))
        }
    }

    // Update auto-fill data based on extracted information
    const updateAutoFillData = (documentType: DocumentType, extractedData: ExtractedDocumentData) => {
        setAutoFillData(prev => {
            const updated = { ...prev }

            if (documentType === 'nrcFront') {
                const nrcData = extractedData as NRCFrontData
                updated.fullName = nrcData.fullName || undefined
                updated.dateOfBirth = nrcData.dateOfBirth || undefined
                updated.nrcNumber = nrcData.nrcNumber || undefined
                updated.confidence = {
                    ...updated.confidence,
                    nrc: nrcData.confidence,
                }
            } else if (documentType === 'nrcBack') {
                const nrcData = extractedData as NRCBackData
                updated.address = nrcData.address || undefined
                updated.confidence = {
                    ...updated.confidence,
                    address: nrcData.confidence,
                }
            } else if (documentType === 'payslip') {
                const payslipData = extractedData as PayslipData
                updated.monthlyIncome = payslipData.monthlyNetSalary || payslipData.monthlyGrossSalary || undefined
                updated.employerName = payslipData.employerName || undefined
                updated.employmentStatus = 'employed'
                updated.confidence = {
                    ...updated.confidence,
                    payslip: payslipData.confidence,
                }
            }

            return updated
        })

        // Show auto-fill dialog if we have enough data
        if (autoFillData && (autoFillData.fullName || autoFillData.monthlyIncome)) {
            setShowAutoFillDialog(true)
        }
    }

    // Apply auto-fill data to form
    const applyAutoFillData = () => {
        if (!autoFillData) return

        // Note: We don't auto-fill form fields directly as they may not exist in all loan types
        // Instead, we show the extracted data and let users confirm

        toast.success('Auto-fill applied!', {
            description: 'Extracted data has been prepared. Please review before submitting.',
        })

        setShowAutoFillDialog(false)
    }

    // Verify NRC documents match
    const verifyNRCDocuments = async () => {
        if (!uploadedFiles.nrcFront || !uploadedFiles.nrcBack) return

        try {
            toast.info('Verifying NRC documents...', {
                description: 'AI is checking if your NRC front and back match',
            })

            const response = await fetch('/api/process-document', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nrcFrontUrl: uploadedFiles.nrcFront.url,
                    nrcBackUrl: uploadedFiles.nrcBack.url,
                }),
            })

            const result = await response.json()

            if (result.success && result.verification) {
                if (result.verification.match) {
                    toast.success('NRC Verified!', {
                        description: `Documents match with ${result.verification.confidence}% confidence`,
                        icon: <CheckCircle2 className="h-4 w-4" />,
                    })
                } else {
                    toast.warning('NRC Mismatch', {
                        description: result.verification.reason || 'Documents may not match',
                        icon: <AlertTriangle className="h-4 w-4" />,
                    })
                }
            }
        } catch (error) {
            console.error('Error verifying NRC:', error)
        }
    }

    // Handle file upload completion with AI processing
    const handleUploadComplete = async (res: { name: string; url: string; size: number }[], fieldName: 'nrcFront' | 'nrcBack' | 'payslip' | 'proofOfAddress' | 'liveSelfie' | 'bankStatement' | 'landOwnership' | 'utilityBill' | 'vendorQuotation' | 'subsidyReceipt') => {
        setUploadingField(null)
        if (res && res.length > 0) {
            const file = res[0]
            setUploadedFiles(prev => ({ ...prev, [fieldName]: file }))
            form.setValue(fieldName as any, file.url)
            toast.success(`${fieldName.replace(/([A-Z])/g, ' $1').trim()} uploaded successfully`)

            // Trigger AI processing for relevant documents
            if (['nrcFront', 'nrcBack', 'payslip', 'utilityBill', 'landOwnership', 'vendorQuotation', 'subsidyReceipt', 'proofOfAddress'].includes(fieldName)) {
                await processDocumentWithAI(file.url, fieldName as DocumentType)
            }

            // If both NRC documents are uploaded, verify they match
            if (fieldName === 'nrcBack' && uploadedFiles.nrcFront) {
                await verifyNRCDocuments()
            } else if (fieldName === 'nrcFront' && uploadedFiles.nrcBack) {
                await verifyNRCDocuments()
            }
        }
    }

    // Remove uploaded file
    const removeFile = (fieldName: 'nrcFront' | 'nrcBack' | 'payslip' | 'proofOfAddress' | 'liveSelfie' | 'bankStatement' | 'landOwnership' | 'utilityBill' | 'vendorQuotation' | 'subsidyReceipt') => {
        setUploadedFiles(prev => {
            const newFiles = { ...prev }
            delete newFiles[fieldName]
            return newFiles
        })
        form.setValue(fieldName as any, "")

        // Clear AI verification for this document
        setDocumentVerifications(prev => {
            const newVerifications = { ...prev }
            delete newVerifications[fieldName]
            return newVerifications
        })
    }

    const watchedValues = form.watch()

    // Create a stable string representation of watched values for dependency tracking
    const watchedValuesKey = useMemo(() => {
        return JSON.stringify(watchedValues)
    }, [watchedValues])

    // Calculate form progress
    useEffect(() => {
        const allFields = Object.keys(form.getValues())

        // Exclude document fields if documents already exist
        const documentFields = isPersonalLoan || isSolarEquipment
            ? (isPersonalLoan
                ? ['nrcFront', 'nrcBack', 'payslip', 'proofOfAddress', 'liveSelfie', 'bankStatement']
                : ['nrcFront', 'nrcBack', 'landOwnership', 'utilityBill', 'vendorQuotation', 'subsidyReceipt'])
            : []

        // Filter out document fields if documents already exist
        const fieldsToCount = hasExistingDocuments && (isPersonalLoan || isSolarEquipment)
            ? allFields.filter(field => !documentFields.includes(field))
            : allFields

        const filledFields = fieldsToCount.filter((field) => {
            const value = form.getValues(field as keyof ApplicationFormValues)
            return value !== undefined && value !== "" && value !== null
        })

        const progress = fieldsToCount.length > 0 ? (filledFields.length / fieldsToCount.length) * 100 : 0
        setFormProgress(progress)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedValuesKey, hasExistingDocuments, isPersonalLoan, isSolarEquipment])

    async function onSubmit(values: ApplicationFormValues) {
        setIsSubmitting(true)

        try {
            // Validation for Personal Loans
            if (isPersonalLoan && !hasExistingDocuments) {
                if (!uploadedFiles.nrcFront || !uploadedFiles.nrcBack || !uploadedFiles.payslip) {
                    toast.error("Please upload all required documents (NRC Front, NRC Back, Payslip)")
                    setIsSubmitting(false)
                    return
                }

                const documentsResponse = await fetch('/api/user-documents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serviceType: "Personal Loans",
                        nrcFront: uploadedFiles.nrcFront.url,
                        nrcBack: uploadedFiles.nrcBack.url,
                        payslip: uploadedFiles.payslip.url,
                        proofOfAddress: uploadedFiles.proofOfAddress?.url || null,
                        liveSelfie: uploadedFiles.liveSelfie?.url || null,
                        bankStatement: uploadedFiles.bankStatement?.url || null,
                    }),
                })

                if (!documentsResponse.ok) {
                    const errorData = await documentsResponse.json()
                    throw new Error(errorData.error || 'Failed to upload documents')
                }
            }

            // Validation for Solar Equipment
            if (isSolarEquipment && !hasExistingDocuments) {
                if (!uploadedFiles.nrcFront || !uploadedFiles.nrcBack || !uploadedFiles.landOwnership || !uploadedFiles.utilityBill || !uploadedFiles.vendorQuotation || !uploadedFiles.subsidyReceipt) {
                    toast.error("Please upload all required documents: NRC Front, NRC Back, Land Ownership, Utility Bill, Vendor Quotation, and Subsidy Receipt")
                    setIsSubmitting(false)
                    return
                }

                const documentsResponse = await fetch('/api/user-documents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serviceType: "Solar Equipment",
                        nrcFront: uploadedFiles.nrcFront.url,
                        nrcBack: uploadedFiles.nrcBack.url,
                        landOwnership: uploadedFiles.landOwnership.url,
                        utilityBill: uploadedFiles.utilityBill.url,
                        vendorQuotation: uploadedFiles.vendorQuotation.url,
                        subsidyReceipt: uploadedFiles.subsidyReceipt.url,
                    }),
                })

                if (!documentsResponse.ok) {
                    const errorData = await documentsResponse.json()
                    throw new Error(errorData.error || 'Failed to upload documents')
                }
            }

            const applicationData: any = {
                serviceId: service.id,
                serviceName: service.name,
                serviceCategory: service.category,
                ...values,
                amount: Number(values.amount),
            }

            // Only include monthlyIncome for individual loans (not Village Banking)
            if (!isVillageBanking && 'monthlyIncome' in values) {
                applicationData.monthlyIncome = values.monthlyIncome ? Number(values.monthlyIncome) : undefined
            }

            const response = await fetch("/api/loan-applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(applicationData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.error || "Failed to submit application"

                // Check if it's a profile update error
                if (errorMessage.includes("Please update your profile") || errorMessage.includes("National ID and Address")) {
                    setProfileError(errorMessage)
                    toast.error("Profile Update Required", {
                        description: errorMessage,
                        action: {
                            label: "Update Profile",
                            onClick: () => router.push("/dashboard/settings"),
                        },
                        duration: 10000, // Show for 10 seconds
                    })
                    setIsSubmitting(false)
                    return
                }

                throw new Error(errorMessage)
            }

            // Clear any previous profile errors on success
            setProfileError(null)

            toast.success("Application submitted successfully!", {
                description: "We'll review your application and get back to you soon.",
            })

            router.push("/services?application=success")
        } catch (error) {
            console.error("Error submitting application:", error)
            toast.error(error instanceof Error ? error.message : "Failed to submit application")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-linear-to-r from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-primary/10 dark:border-blue-800/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Progress</span>
                    <span className="text-sm font-bold text-primary dark:text-white">{Math.round(formProgress)}%</span>
                </div>
                <Progress value={formProgress} className="h-2" />
            </div>

            {/* AI Processing Status */}
            {Object.keys(documentVerifications).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/30"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">AI Document Analysis</h4>
                        <Badge variant="outline" className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                            <Zap className="h-3 w-3 mr-1" />
                            Powered by OpenAI
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(documentVerifications).map(([docType, verification]) => (
                            <motion.div
                                key={docType}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative">
                                        {verification.status === 'processing' && (
                                            <Loader2 className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-spin" />
                                        )}
                                        {verification.status === 'success' && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        )}
                                        {verification.status === 'error' && (
                                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {docType.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        {verification.status === 'processing' && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Analyzing document...</p>
                                        )}
                                        {verification.status === 'success' && verification.extractedData && (
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                Data extracted • {(verification.extractedData as any).confidence}% confidence
                                            </p>
                                        )}
                                        {verification.status === 'error' && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                {verification.error || 'Processing failed'}
                                            </p>
                                        )}
                                    </div>
                                    {verification.status === 'success' && verification.extractedData && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                            onClick={() => {
                                                toast.info('Extracted Data', {
                                                    description: JSON.stringify(verification.extractedData, null, 2),
                                                })
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {autoFillData && (autoFillData.fullName || autoFillData.monthlyIncome) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-linear-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                            Auto-fill Available
                                        </p>
                                    </div>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-2">
                                        We've extracted information from your documents that can help fill your application.
                                    </p>
                                    <div className="space-y-1 text-xs">
                                        {autoFillData.fullName && (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-3 w-3 text-emerald-600" />
                                                <span className="text-gray-700 dark:text-gray-300">Name: {autoFillData.fullName}</span>
                                            </div>
                                        )}
                                        {autoFillData.monthlyIncome && (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-3 w-3 text-emerald-600" />
                                                <span className="text-gray-700 dark:text-gray-300">Income: K{autoFillData.monthlyIncome.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {autoFillData.address && (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-3 w-3 text-emerald-600" />
                                                <span className="text-gray-700 dark:text-gray-300">Address: {autoFillData.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={applyAutoFillData}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white ml-3"
                                >
                                    <Zap className="h-3 w-3 mr-1" />
                                    Review
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Profile Update Error Alert */}
            {profileError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <Alert variant="destructive" className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-red-900 dark:text-red-100">Profile Update Required</AlertTitle>
                        <AlertDescription className="text-red-800 dark:text-red-200 mt-2">
                            {profileError}
                            <div className="mt-3">
                                <Button
                                    type="button"
                                    onClick={() => router.push("/dashboard/settings")}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    size="sm"
                                >
                                    Update Profile Now
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="form" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Application</span>
                    </TabsTrigger>
                    <TabsTrigger value="calculator" className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        <span className="hidden sm:inline">Calculator</span>
                    </TabsTrigger>
                    <TabsTrigger value="eligibility" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Eligibility</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="mt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">



                            <Separator />

                            {/* Loan Details Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-lg bg-[#00CC66]/10 dark:bg-emerald-900/30">
                                        <DollarSign className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary dark:text-white">Loan Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Loan Amount (ZMK)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="5000" {...field} className="border-primary/20 focus:border-[#00CC66]" />
                                                </FormControl>
                                                <FormDescription>Enter the amount you wish to borrow</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="repaymentPeriod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Repayment Period
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-primary/20 focus:border-[#00CC66]">
                                                            <SelectValue placeholder="Select period" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="3">3 months</SelectItem>
                                                        <SelectItem value="6">6 months</SelectItem>
                                                        <SelectItem value="12">12 months</SelectItem>
                                                        <SelectItem value="24">24 months</SelectItem>
                                                        <SelectItem value="36">36 months</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="purpose"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Loan Purpose
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain in detail how you plan to use this loan..."
                                                    className="resize-none min-h-[100px] border-primary/20 focus:border-[#00CC66]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>Provide a detailed explanation of your loan purpose ({field.value.length}/500)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Employment & Income Section - Only for Individual Loans (not Village Banking) */}
                            {!isVillageBanking && (
                                <>
                                    <Separator />

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 rounded-lg bg-primary/10 dark:bg-blue-900/30">
                                                <Building className="h-5 w-5 text-primary dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary dark:text-white">Employment & Income</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="employmentStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Building className="h-4 w-4" />
                                                            Employment Status
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="border-primary/20 focus:border-[#00CC66]">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="employed">Employed</SelectItem>
                                                                <SelectItem value="self-employed">Self-Employed</SelectItem>
                                                                <SelectItem value="farmer">Farmer</SelectItem>
                                                                <SelectItem value="business-owner">Business Owner</SelectItem>
                                                                <SelectItem value="unemployed">Unemployed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="monthlyIncome"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4" />
                                                            Monthly Income (ZMK)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="3000" {...field} className="border-primary/20 focus:border-[#00CC66]" />
                                                        </FormControl>
                                                        <FormDescription>Optional</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="businessDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        Business/Farming Details
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="If self-employed or farmer, describe your business or farming activities..."
                                                            className="resize-none border-primary/20 focus:border-[#00CC66]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Optional - relevant for farmers and business owners</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                </>
                            )}

                            {/* Group Selection Section - Only for Village Banking */}
                            {isVillageBanking && (
                                <>
                                    <Separator />

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 rounded-lg bg-[#00CC66]/10 dark:bg-emerald-900/30">
                                                <Building className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary dark:text-white">Select Your Group</h3>
                                        </div>

                                        {isLoadingGroups ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-blue-400" />
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your groups...</span>
                                            </div>
                                        ) : groupsError ? (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>
                                                    Failed to load your groups. Please refresh the page and try again.
                                                </AlertDescription>
                                            </Alert>
                                        ) : groups.length === 0 ? (
                                            <Alert className="border-[#00CC66]/20 bg-[#00CC66]/5 dark:bg-emerald-900/10">
                                                <Info className="h-4 w-4 text-[#00CC66] dark:text-emerald-400" />
                                                <AlertTitle className="text-primary dark:text-white">No Groups Found</AlertTitle>
                                                <AlertDescription className="text-gray-600 dark:text-gray-400">
                                                    You need to be a member of a village banking group to apply for this loan.
                                                    <br />
                                                    <a
                                                        href="/dashboard/groups"
                                                        className="text-[#00CC66] dark:text-emerald-400 hover:underline font-medium mt-2 inline-block"
                                                    >
                                                        Create or join a group →
                                                    </a>
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <FormField
                                                control={form.control}
                                                name={"groupId" as any}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Choose a group to apply for the loan from</FormLabel>
                                                        <FormControl>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {groups.map((group) => (
                                                                    <motion.div
                                                                        key={group.id}
                                                                        whileHover={{ scale: 1.02 }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                        className="relative"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            id={`group-${group.id}`}
                                                                            value={group.id}
                                                                            checked={field.value === group.id}
                                                                            onChange={(e) => {
                                                                                field.onChange(e.target.value)
                                                                                setSelectedGroup(e.target.value)
                                                                            }}
                                                                            className="peer sr-only"
                                                                        />
                                                                        <label
                                                                            htmlFor={`group-${group.id}`}
                                                                            className="flex flex-col p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-[#00CC66] dark:hover:border-emerald-500 peer-checked:border-[#00CC66] dark:peer-checked:border-emerald-500 peer-checked:bg-[#00CC66]/5 dark:peer-checked:bg-emerald-900/20 transition-all"
                                                                        >
                                                                            <div className="flex items-start justify-between mb-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    {group.logo ? (
                                                                                        <img
                                                                                            src={group.logo}
                                                                                            alt={group.name}
                                                                                            className="w-10 h-10 rounded-full object-cover"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-blue-900/30 flex items-center justify-center">
                                                                                            <Building className="h-5 w-5 text-primary dark:text-blue-400" />
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <h4 className="font-semibold text-primary dark:text-white">
                                                                                            {group.name}
                                                                                        </h4>
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                            {group.memberships.length} member{group.memberships.length !== 1 ? 's' : ''}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="peer-checked:block hidden">
                                                                                    <CheckCircle2 className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                                                                                </div>
                                                                            </div>

                                                                            {group.description && (
                                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                                                    {group.description}
                                                                                </p>
                                                                            )}

                                                                            <div className="flex items-center justify-between text-xs">
                                                                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                                    <DollarSign className="h-3 w-3" />
                                                                                    <span>K{Number(group.contributionAmount).toLocaleString()}/{group.contributionFrequency.toLowerCase()}</span>
                                                                                </div>
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="text-[#00CC66] border-[#00CC66] dark:text-emerald-400 dark:border-emerald-500">
                                                                                    {group.status}
                                                                                </Badge>
                                                                            </div>
                                                                        </label>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Select the group you want to request the loan from
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </motion.div>
                                </>
                            )}

                            {/* Document Upload Section - Only for Personal Loans WITHOUT existing documents */}
                            {isPersonalLoan && !hasExistingDocuments && !checkingDocuments && (
                                <>
                                    <Separator />

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 rounded-lg bg-[#00CC66]/10 dark:bg-emerald-900/30">
                                                <Upload className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary dark:text-white">Required Documents</h3>
                                        </div>

                                        <Alert className="border-primary/20 dark:border-blue-800/30">
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>Document Requirements</AlertTitle>
                                            <AlertDescription>
                                                Please upload clear, readable copies of your documents. Accepted formats: JPG, PNG, PDF (max 5MB each)
                                            </AlertDescription>
                                        </Alert>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* NRC Front */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    NRC (Front)
                                                </label>
                                                {!uploadedFiles.nrcFront ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'nrcFront' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                        <UploadButton
                                                            endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('nrcFront')}
                                                            onClientUploadComplete={(res) => handleUploadComplete(res, 'nrcFront')}
                                                            onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                toast.error(`Upload failed: ${error.message}`)
                                                            }}
                                                            appearance={{
                                                                button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                allowedContent: "text-gray-500 dark:text-gray-400"
                                                            }}
                                                            content={{
                                                                button: "Upload NRC Front"
                                                            }}
                                                        />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.nrcFront.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.nrcFront.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('nrcFront')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* NRC Back */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    NRC (Back)
                                                </label>
                                                {!uploadedFiles.nrcBack ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'nrcBack' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                        <UploadButton
                                                            endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('nrcBack')}
                                                            onClientUploadComplete={(res) => handleUploadComplete(res, 'nrcBack')}
                                                            onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                toast.error(`Upload failed: ${error.message}`)
                                                            }}
                                                            appearance={{
                                                                button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                allowedContent: "text-gray-500 dark:text-gray-400"
                                                            }}
                                                            content={{
                                                                button: "Upload NRC Back"
                                                            }}
                                                        />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.nrcBack.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.nrcBack.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('nrcBack')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payslip */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Recent Payslip
                                            </label>
                                            {!uploadedFiles.payslip ? (
                                                <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                    {uploadingField === 'payslip' ? (
                                                        <div className="flex flex-col items-center justify-center py-4">
                                                            <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                            <p className="text-sm text-gray-500">Uploading...</p>
                                                        </div>
                                                    ) : (
                                                        <UploadButton
                                                            endpoint="loanDocumentUploader"
                                                            onUploadBegin={() => setUploadingField('payslip')}
                                                            onClientUploadComplete={(res) => handleUploadComplete(res, 'payslip')}
                                                            onUploadError={(error: Error) => {
                                                                setUploadingField(null)
                                                                toast.error(`Upload failed: ${error.message}`)
                                                            }}
                                                            appearance={{
                                                                button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                allowedContent: "text-gray-500 dark:text-gray-400"
                                                            }}
                                                            content={{
                                                                button: "Upload Payslip"
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.payslip.name}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.payslip.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeFile('payslip')}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Optional Documents Section */}
                                        <div className="mt-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Optional Documents</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                These documents are optional but may help speed up your application process.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Proof of Address */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        Proof of Address (Optional)
                                                    </label>
                                                    {!uploadedFiles.proofOfAddress ? (
                                                        <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                            {uploadingField === 'proofOfAddress' ? (
                                                                <div className="flex flex-col items-center justify-center py-4">
                                                                    <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                    <p className="text-sm text-gray-500">Uploading...</p>
                                                                </div>
                                                            ) : (
                                                                <UploadButton
                                                                    endpoint="loanDocumentUploader"
                                                                    onUploadBegin={() => setUploadingField('proofOfAddress')}
                                                                    onClientUploadComplete={(res) => handleUploadComplete(res, 'proofOfAddress')}
                                                                    onUploadError={(error: Error) => {
                                                                        setUploadingField(null)
                                                                        toast.error(`Upload failed: ${error.message}`)
                                                                    }}
                                                                    appearance={{
                                                                        button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                        allowedContent: "text-gray-500 dark:text-gray-400"
                                                                    }}
                                                                    content={{
                                                                        button: "Upload Proof of Address"
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.proofOfAddress.name}</p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.proofOfAddress.size / 1024).toFixed(2)} KB</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeFile('proofOfAddress')}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Live Selfie */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        Live Selfie (Optional)
                                                    </label>
                                                    {!uploadedFiles.liveSelfie ? (
                                                        <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                            {uploadingField === 'liveSelfie' ? (
                                                                <div className="flex flex-col items-center justify-center py-4">
                                                                    <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                    <p className="text-sm text-gray-500">Uploading...</p>
                                                                </div>
                                                            ) : (
                                                                <UploadButton
                                                                    endpoint="loanDocumentUploader"
                                                                    onUploadBegin={() => setUploadingField('liveSelfie')}
                                                                    onClientUploadComplete={(res) => handleUploadComplete(res, 'liveSelfie')}
                                                                    onUploadError={(error: Error) => {
                                                                        setUploadingField(null)
                                                                        toast.error(`Upload failed: ${error.message}`)
                                                                    }}
                                                                    appearance={{
                                                                        button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                        allowedContent: "text-gray-500 dark:text-gray-400"
                                                                    }}
                                                                    content={{
                                                                        button: "Upload Live Selfie"
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.liveSelfie.name}</p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.liveSelfie.size / 1024).toFixed(2)} KB</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeFile('liveSelfie')}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bank Statement */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        Bank Statement (Optional)
                                                    </label>
                                                    {!uploadedFiles.bankStatement ? (
                                                        <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                            {uploadingField === 'bankStatement' ? (
                                                                <div className="flex flex-col items-center justify-center py-4">
                                                                    <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                    <p className="text-sm text-gray-500">Uploading...</p>
                                                                </div>
                                                            ) : (
                                                                <UploadButton
                                                                    endpoint="loanDocumentUploader"
                                                                    onUploadBegin={() => setUploadingField('bankStatement')}
                                                                    onClientUploadComplete={(res) => handleUploadComplete(res, 'bankStatement')}
                                                                    onUploadError={(error: Error) => {
                                                                        setUploadingField(null)
                                                                        toast.error(`Upload failed: ${error.message}`)
                                                                    }}
                                                                    appearance={{
                                                                        button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                        allowedContent: "text-gray-500 dark:text-gray-400"
                                                                    }}
                                                                    content={{
                                                                        button: "Upload Bank Statement"
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.bankStatement.name}</p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.bankStatement.size / 1024).toFixed(2)} KB</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeFile('bankStatement')}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}

                            {/* Document Upload Section - Only for Solar Equipment WITHOUT existing documents */}
                            {isSolarEquipment && !hasExistingDocuments && !checkingDocuments && (
                                <>
                                    <Separator />

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 rounded-lg bg-[#00CC66]/10 dark:bg-emerald-900/30">
                                                <Upload className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary dark:text-white">Required Documents</h3>
                                        </div>

                                        <Alert className="border-primary/20 dark:border-blue-800/30">
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>Document Requirements for Solar Equipment</AlertTitle>
                                            <AlertDescription>
                                                Please upload clear, readable copies of all required documents. Accepted formats: JPG, PNG, PDF (max 5MB each)
                                            </AlertDescription>
                                        </Alert>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* NRC Front */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    NRC (Front)
                                                </label>
                                                {!uploadedFiles.nrcFront ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'nrcFront' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                        <UploadButton
                                                            endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('nrcFront')}
                                                            onClientUploadComplete={(res) => handleUploadComplete(res, 'nrcFront')}
                                                            onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                toast.error(`Upload failed: ${error.message}`)
                                                            }}
                                                            appearance={{
                                                                button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                allowedContent: "text-gray-500 dark:text-gray-400"
                                                            }}
                                                            content={{
                                                                button: "Upload NRC Front"
                                                            }}
                                                        />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.nrcFront.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.nrcFront.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('nrcFront')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* NRC Back */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    NRC (Back)
                                                </label>
                                                {!uploadedFiles.nrcBack ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'nrcBack' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                        <UploadButton
                                                            endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('nrcBack')}
                                                            onClientUploadComplete={(res) => handleUploadComplete(res, 'nrcBack')}
                                                            onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                toast.error(`Upload failed: ${error.message}`)
                                                            }}
                                                            appearance={{
                                                                button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                allowedContent: "text-gray-500 dark:text-gray-400"
                                                            }}
                                                            content={{
                                                                button: "Upload NRC Back"
                                                            }}
                                                        />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.nrcBack.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.nrcBack.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('nrcBack')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Land Ownership */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Land Ownership
                                                </label>
                                                {!uploadedFiles.landOwnership ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'landOwnership' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                            <UploadButton
                                                                endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('landOwnership')}
                                                                onClientUploadComplete={(res) => handleUploadComplete(res, 'landOwnership')}
                                                                onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                    toast.error(`Upload failed: ${error.message}`)
                                                                }}
                                                                appearance={{
                                                                    button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                    allowedContent: "text-gray-500 dark:text-gray-400"
                                                                }}
                                                                content={{
                                                                    button: "Upload Land Ownership"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.landOwnership.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.landOwnership.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('landOwnership')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Utility Bill */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Utility Bill
                                                </label>
                                                {!uploadedFiles.utilityBill ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'utilityBill' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                            <UploadButton
                                                                endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('utilityBill')}
                                                                onClientUploadComplete={(res) => handleUploadComplete(res, 'utilityBill')}
                                                                onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                    toast.error(`Upload failed: ${error.message}`)
                                                                }}
                                                                appearance={{
                                                                    button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                    allowedContent: "text-gray-500 dark:text-gray-400"
                                                                }}
                                                                content={{
                                                                    button: "Upload Utility Bill"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.utilityBill.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.utilityBill.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('utilityBill')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Vendor Quotation */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Vendor Quotation
                                                </label>
                                                {!uploadedFiles.vendorQuotation ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'vendorQuotation' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                            <UploadButton
                                                                endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('vendorQuotation')}
                                                                onClientUploadComplete={(res) => handleUploadComplete(res, 'vendorQuotation')}
                                                                onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                    toast.error(`Upload failed: ${error.message}`)
                                                                }}
                                                                appearance={{
                                                                    button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                    allowedContent: "text-gray-500 dark:text-gray-400"
                                                                }}
                                                                content={{
                                                                    button: "Upload Vendor Quotation"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.vendorQuotation.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.vendorQuotation.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('vendorQuotation')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Subsidy Receipt */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Subsidy Receipt
                                                </label>
                                                {!uploadedFiles.subsidyReceipt ? (
                                                    <div className="border-2 border-dashed border-primary/20 dark:border-blue-800/30 rounded-lg p-6 text-center hover:border-[#00CC66] dark:hover:border-emerald-600 transition-colors">
                                                        {uploadingField === 'subsidyReceipt' ? (
                                                            <div className="flex flex-col items-center justify-center py-4">
                                                                <Loader2 className="h-8 w-8 text-[#00CC66] animate-spin mb-2" />
                                                                <p className="text-sm text-gray-500">Uploading...</p>
                                                            </div>
                                                        ) : (
                                                            <UploadButton
                                                                endpoint="loanDocumentUploader"
                                                                onUploadBegin={() => setUploadingField('subsidyReceipt')}
                                                                onClientUploadComplete={(res) => handleUploadComplete(res, 'subsidyReceipt')}
                                                                onUploadError={(error: Error) => {
                                                                    setUploadingField(null)
                                                                    toast.error(`Upload failed: ${error.message}`)
                                                                }}
                                                                appearance={{
                                                                    button: "bg-primary text-white hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800",
                                                                    allowedContent: "text-gray-500 dark:text-gray-400"
                                                                }}
                                                                content={{
                                                                    button: "Upload Subsidy Receipt"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative border border-[#00CC66]/30 dark:border-emerald-800/30 rounded-lg p-4 bg-linear-to-br from-[#00CC66]/5 to-transparent dark:from-emerald-900/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFiles.subsidyReceipt.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(uploadedFiles.subsidyReceipt.size / 1024).toFixed(2)} KB</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile('subsidyReceipt')}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: isPersonalLoan ? 0.4 : 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="w-full sm:w-auto border-primary/20"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Services
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || formProgress < 90}
                                    className="w-full sm:flex-1 bg-linear-to-r from-primary to-[#00CC66] hover:from-primary/90 hover:to-[#00CC66]/90 dark:from-blue-900 dark:to-emerald-700"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Submit Application
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="calculator" className="mt-6">
                    <LoanCalculator
                        service={service}
                        amount={watchedValues.amount || "0"}
                        period={watchedValues.repaymentPeriod || "12"}
                    />
                </TabsContent>

                <TabsContent value="eligibility" className="mt-6">
                    <EligibilityChecker service={service} formData={watchedValues} />
                </TabsContent>
            </Tabs>

            {/* Alert Dialog for Errors */}
            <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            {alertDialogContent.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertDialogContent.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertDialogOpen(false)}>
                            Okay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}

// Service Details Component
function ServiceDetails({ service }: { service: Service }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Service Header */}
            <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-primary to-[#00CC66] dark:from-blue-900 dark:to-emerald-700 p-6 text-white">
                <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-full bg-white/20 backdrop-blur-xs">
                            {getServiceIcon(service.category, service.icon, "h-8 w-8 text-white")}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                            <Badge className="bg-white/20 text-white border-white/30">{service.category}</Badge>
                        </div>
                    </div>
                    <p className="text-white/90 text-sm">{service.description}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            </div>

            {/* Service Image */}
            {service.image && (
                <div className="relative h-[200px] rounded-lg overflow-hidden group">
                    <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                </div>
            )}

            <Separator />

            {/* Key Features */}
            {service.keyFeatures && service.keyFeatures.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-[#00CC66] dark:text-emerald-400" />
                        <h3 className="text-lg font-semibold text-primary dark:text-white">Key Features</h3>
                    </div>
                    <ul className="space-y-3">
                        {service.keyFeatures.map((feature, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-linear-to-r from-[#00CC66]/5 to-transparent dark:from-emerald-900/20 border border-[#00CC66]/10 dark:border-emerald-800/30"
                            >
                                <Check className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            )}

            <Separator />

            {/* Requirements */}
            {service.requirements && service.requirements.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-primary dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-primary dark:text-white">Requirements</h3>
                    </div>
                    <Alert className="border-primary/20 dark:border-blue-800/30">
                        <Info className="h-4 w-4" />
                        <AlertTitle>What you'll need</AlertTitle>
                        <AlertDescription>
                            <ul className="space-y-2 mt-2">
                                {service.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400 mt-1.5 shrink-0" />
                                        <span>{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 rounded-lg bg-linear-to-br from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20 border border-primary/10 dark:border-blue-800/30">
                    <Clock className="h-6 w-6 text-[#00CC66] dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fast Approval</p>
                    <p className="text-sm font-bold text-primary dark:text-white">24-48 hours</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-linear-to-br from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20 border border-primary/10 dark:border-blue-800/30">
                    <Shield className="h-6 w-6 text-[#00CC66] dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Secure Process</p>
                    <p className="text-sm font-bold text-primary dark:text-white">100% Safe</p>
                </div>
            </div>
        </motion.div>
    )
}

// Main Content Component
function ApplyPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const serviceId = searchParams.get("serviceId")

    const { data: service, isLoading, error } = useQuery<Service>({
        queryKey: ["service", serviceId],
        queryFn: () => fetchService(serviceId!),
        enabled: !!serviceId,
    })

    if (!serviceId) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">No Service Selected</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Please select a service to apply for a loan.</p>
                    <Button onClick={() => router.push("/services")} className="bg-primary hover:bg-primary/80">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Services
                    </Button>
                </motion.div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !service) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Service Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {error instanceof Error ? error.message : "The requested service could not be found."}
                    </p>
                    <Button onClick={() => router.push("/services")} className="bg-primary hover:bg-primary/80">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Services
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Page Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/services")}
                        className="mb-4 hover:bg-primary/10"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Services
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-[#00CC66] dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Apply for {service.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Complete the application form below to apply for this loan service
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Application Form - Left Side (2/3 width) */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-primary/10 dark:border-blue-800/30">
                            <CardHeader className="bg-linear-to-r from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20">
                                <CardTitle className="text-xl text-primary dark:text-white flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Application Form
                                </CardTitle>
                                <CardDescription>Fill in your details to apply for this loan</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ApplicationForm service={service} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Service Details - Right Side (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            <Card className="shadow-xl border-primary/10 dark:border-blue-800/30">
                                <CardHeader className="bg-linear-to-r from-primary/5 to-[#00CC66]/5 dark:from-blue-900/20 dark:to-emerald-900/20">
                                    <CardTitle className="text-xl text-primary dark:text-white flex items-center gap-2">
                                        <Info className="h-5 w-5" />
                                        Service Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ServiceDetails service={service} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// Main Page Component with Suspense
export default function ApplyPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Suspense
                fallback={
                    <div className="container mx-auto px-4 py-16 text-center">
                        <Loader2 className="h-16 w-16 animate-spin text-primary dark:text-blue-400 mx-auto" />
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading application form...</p>
                    </div>
                }
            >
                <ApplyPageContent />
            </Suspense>
        </div>
    )
}
