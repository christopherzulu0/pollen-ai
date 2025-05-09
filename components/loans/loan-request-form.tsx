"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    CalendarIcon,
    InfoIcon,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Users,
    DollarSign,
    FileText,
    Calendar,
    ClipboardList,
    ChevronLeft,
    AlertCircle,
} from "lucide-react"
import { format, addMonths } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMediaQuery } from "@/hooks/form"

const formSchema = z.object({
    groupId: z.string({
        required_error: "Please select a group",
    }),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
    }),
    purpose: z.string().min(10, {
        message: "Purpose must be at least 10 characters",
    }),
    repaymentDate: z.date({
        required_error: "Repayment date is required",
    }),
    repaymentTerms: z.string().min(10, {
        message: "Repayment terms must be at least 10 characters",
    }),
    installments: z.number().min(1).default(1),
    interestRate: z.number().min(0).default(0),
})

export default function LoanRequestForm({ preSelectedGroupId }: { preSelectedGroupId?: string }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [formStep, setFormStep] = useState(0)
    const [previewData, setPreviewData] = useState<z.infer<typeof formSchema> | null>(null)
    const [formProgress, setFormProgress] = useState(0)
    const isMobile = useMediaQuery("(max-width: 640px)")

    // State for groups fetched from API
    const [myGroups, setMyGroups] = useState<any[]>([])
    const [isLoadingGroups, setIsLoadingGroups] = useState(false)
    const [groupsError, setGroupsError] = useState("")
    const [totalContributions, setTotalContributions] = useState<number>(0)

    // Fetch groups from API
    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoadingGroups(true)
            setGroupsError("")

            try {
                const response = await fetch('/api/groups')

                if (!response.ok) {
                    throw new Error('Failed to fetch groups')
                }

                const data = await response.json()

                // Map the API response to the format we need
                const formattedGroups = data.map((group: any) => ({
                    id: group.id,
                    name: group.name,
                    maxLoanAmount: group.depositGoal || 2000, // Use depositGoal or default
                    memberCount: group.memberships?.length || 0,
                    availableFunds: 5000, // This would come from the API in a real app
                    interestRate: parseFloat(group.interestRate) || 3,
                }))

                setMyGroups(formattedGroups)
            } catch (error) {
                console.error('Error fetching groups:', error)
                setGroupsError("Failed to load groups. Please try again.")
                // Fallback to mock data if API fails
                setMyGroups([
                    {
                        id: "group1",
                        name: "Savings Group A",
                        maxLoanAmount: 1000,
                        memberCount: 12,
                        availableFunds: 5000,
                        interestRate: 4,
                    },
                    {
                        id: "group2",
                        name: "Investment Club B",
                        maxLoanAmount: 2000,
                        memberCount: 8,
                        availableFunds: 8000,
                        interestRate: 5,
                    },
                    {
                        id: "group3",
                        name: "Community Cooperative",
                        maxLoanAmount: 1500,
                        memberCount: 15,
                        availableFunds: 7500,
                        interestRate: 3,
                    },
                ])
            } finally {
                setIsLoadingGroups(false)
            }
        }

        fetchGroups()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groupId: preSelectedGroupId || "",
            purpose: "",
            repaymentTerms: "",
            installments: 1,
            interestRate: 0,
        },
        mode: "onChange",
    })

    const watchGroupId = form.watch("groupId")
    const watchAmount = form.watch("amount")
    const watchRepaymentDate = form.watch("repaymentDate")
    const watchInstallments = form.watch("installments")
    const watchInterestRate = form.watch("interestRate")

    // Update form progress whenever form values change
    const updateFormProgress = () => {
        const fields = ["groupId", "amount", "purpose", "repaymentDate", "repaymentTerms"]
        const filledFields = fields.filter((field) => {
            const value = form.getValues(field as any)
            return value !== undefined && value !== ""
        })

        setFormProgress((filledFields.length / fields.length) * 100)
    }

    // Update progress when form values change
    useState(() => {
        const subscription = form.watch(() => updateFormProgress())
        return () => subscription.unsubscribe()
    })

    const selectedGroup = myGroups.find((group) => group.id === watchGroupId)

    // Fetch total contributions when selected group changes
    useEffect(() => {
        const fetchTotalContributions = async () => {
            if (watchGroupId) {
                try {
                    const response = await fetch(`/api/contributions?groupId=${watchGroupId}`)
                    if (response.ok) {
                        const data = await response.json()
                        setTotalContributions(data.statistics.totalContributions || 0)
                    } else {
                        console.error("Failed to fetch total contributions")
                        setTotalContributions(0)
                    }
                } catch (error) {
                    console.error("Error fetching total contributions:", error)
                    setTotalContributions(0)
                }
            } else {
                setTotalContributions(0)
            }
        }

        fetchTotalContributions()
    }, [watchGroupId])

    // Calculate monthly installment amount
    const calculateMonthlyPayment = () => {
        if (!watchAmount || !watchInstallments) return 0

        const principal = Number.parseFloat(watchAmount)
        const interest = principal * (watchInterestRate / 100)
        const total = principal + interest

        return total / watchInstallments
    }

    const monthlyPayment = calculateMonthlyPayment()

    const nextStep = async () => {
        const isValid = await form.trigger(["groupId", "amount", "purpose", "repaymentDate", "repaymentTerms"])

        if (isValid) {
            setPreviewData(form.getValues())
            setFormStep(1)
            // Scroll to top on mobile when changing steps
            if (isMobile) {
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        }
    }

    const prevStep = () => {
        setFormStep(0)
        // Scroll to top on mobile when changing steps
        if (isMobile) {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        try {
            // Make API call to create a loan request
            const response = await fetch('/api/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit loan request');
            }

            const data = await response.json();
            console.log("Loan request submitted:", data);

            toast({
                title: "Loan request submitted",
                description: "Your loan request has been submitted for voting.",
            })

            form.reset()
            router.push("/dashboard/groups/saving-groups?tab=my-requests")
        } catch (error) {
            console.error("Error submitting loan request:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit loan request. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
        if (isNaN(numAmount)) return "ZMK 0.00"

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ZMK",
        }).format(numAmount)
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <style jsx global>{`
        .calendar-popover {
          z-index: 100;
          width: auto !important;
          min-width: 320px !important;
          overflow: visible !important;
          position: absolute !important;
          pointer-events: auto !important;
          transform: translateZ(0) !important;
          max-height: none !important;
        }
      `}</style>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">New Loan Request</h2>
                    <p className="text-muted-foreground">Fill out the form to request a loan from your group</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Form Progress:</span>
                    <div className="w-full sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-in-out"
                            style={{ width: `${formProgress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium">{Math.round(formProgress)}%</span>
                </div>
            </div>

            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="w-full overflow-hidden">
                    <TabsList className="w-full grid grid-cols-3 mb-4">
                        <TabsTrigger value="details" className="px-2 py-1.5">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <FileText className="h-4 w-4 mr-1" />
                <span>Loan Details</span>
              </span>
                        </TabsTrigger>
                        <TabsTrigger value="calculator" className="px-2 py-1.5">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>Calculator</span>
              </span>
                        </TabsTrigger>
                        <TabsTrigger value="faq" className="px-2 py-1.5">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <InfoIcon className="h-4 w-4 mr-1" />
                <span>FAQ</span>
              </span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="details" className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">{formStep === 0 ? "Enter Loan Details" : "Review & Submit"}</CardTitle>
                            <CardDescription>
                                {formStep === 0
                                    ? "Provide the details of your loan request"
                                    : "Review your loan request before submitting"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent >
                            {formStep === 0 ? (
                                <Form {...form}>
                                    <form className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="groupId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            Select Group
                                                        </FormLabel>
                                                        {selectedGroup && (
                                                            <Badge variant="outline" className="font-normal">
                                                                {selectedGroup.memberCount} members
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {isLoadingGroups ? (
                                                        <FormControl>
                                                            <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                <span className="text-sm">Loading groups...</span>
                                                            </div>
                                                        </FormControl>
                                                    ) : groupsError ? (
                                                        <FormControl>
                                                            <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-destructive">
                                                                <AlertCircle className="h-4 w-4" />
                                                                <span className="text-sm">{groupsError}</span>
                                                            </div>
                                                        </FormControl>
                                                    ) : (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a group" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {myGroups.map((group) => (
                                                                    <SelectItem key={group.id} value={group.id}>
                                                                        {group.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                                        <FormDescription>Choose the group you want to request a loan from</FormDescription>
                                                        {selectedGroup && (
                                                            <span className="text-xs text-muted-foreground">
                                Total Contributions: {formatCurrency(totalContributions)}
                              </span>
                                                        )}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4" />
                                                        Loan Amount
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                ZMK
                              </span>
                                                            <Input
                                                                placeholder="0.00"
                                                                {...field}
                                                                className="pl-12"
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                inputMode="decimal"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                                        <FormDescription>Enter the amount you wish to borrow</FormDescription>
                                                        {selectedGroup && watchAmount && !isNaN(Number.parseFloat(watchAmount)) && (
                                                            <span
                                                                className={`text-xs ${Number.parseFloat(watchAmount) > totalContributions ? "text-destructive" : "text-muted-foreground"}`}
                                                            >
                                {Number.parseFloat(watchAmount) > totalContributions
                                    ? "Exceeds maximum"
                                    : "Within limit"}
                              </span>
                                                        )}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

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
                                                            placeholder="Explain why you need this loan..."
                                                            className="resize-none min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                                        <FormDescription>Clearly explain how you plan to use the funds</FormDescription>
                                                        <span className="text-xs text-muted-foreground">{field.value.length} / 500 chars</span>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="repaymentDate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            Repayment Date
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                                                    >
                                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="calendar-popover p-0" align="start" side="bottom" avoidCollisions={false}>
                                                                <CalendarComponent
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            field.onChange(date)
                                                                        }
                                                                    }}
                                                                    disabled={(date) => date < new Date()}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription className="flex items-center gap-1">
                                                            When do you plan to repay the loan?
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <InfoIcon className="h-3 w-3 cursor-help" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="max-w-xs">Must be a future date</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="installments"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <ClipboardList className="h-4 w-4" />
                                                            Number of Installments
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                                    <span>1</span>
                                                                    <span>12</span>
                                                                </div>
                                                                <Slider
                                                                    min={1}
                                                                    max={12}
                                                                    step={1}
                                                                    value={[field.value]}
                                                                    onValueChange={(value) => field.onChange(value[0])}
                                                                />
                                                                <div className="text-center font-medium">
                                                                    {field.value} {field.value === 1 ? "payment" : "payments"}
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>How many installments will you make?</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="interestRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4" />
                                                            Interest Rate (%)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                                    <span>0%</span>
                                                                    <span>10%</span>
                                                                </div>
                                                                <Slider
                                                                    min={0}
                                                                    max={10}
                                                                    step={0.5}
                                                                    value={[field.value]}
                                                                    onValueChange={(value) => field.onChange(value[0])}
                                                                />
                                                                <div className="text-center font-medium">{field.value}%</div>
                                                            </div>
                                                        </FormControl>
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                                            <FormDescription>Proposed interest rate</FormDescription>
                                                            {selectedGroup && (
                                                                <span className="text-xs text-muted-foreground">
                                  Recommended: {selectedGroup.interestRate}%
                                </span>
                                                            )}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="repaymentTerms"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4" />
                                                            Additional Terms
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Any additional repayment details..."
                                                                className="resize-none h-[104px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>Any additional repayment details</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <div className="space-y-6 py-4">
                                    {previewData && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Group</h3>
                                                        <p className="font-medium">{myGroups.find((g) => g.id === previewData.groupId)?.name}</p>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                                                        <p className="font-medium text-lg">{formatCurrency(previewData.amount)}</p>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Repayment Date</h3>
                                                        <p className="font-medium">{format(previewData.repaymentDate, "PPP")}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Interest Rate</h3>
                                                        <p className="font-medium">{previewData.interestRate}%</p>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Installments</h3>
                                                        <p className="font-medium">
                                                            {previewData.installments} {previewData.installments === 1 ? "payment" : "payments"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Payment</h3>
                                                        <p className="font-medium text-lg">{formatCurrency(monthlyPayment)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Loan Purpose</h3>
                                                <p className="text-sm">{previewData.purpose}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Repayment Terms</h3>
                                                <p className="text-sm">{previewData.repaymentTerms}</p>
                                            </div>

                                            <div className="rounded-lg border bg-muted/50 p-4">
                                                <div className="flex items-start gap-3">
                                                    <InfoIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                                    <div>
                                                        <h4 className="font-medium mb-1">What happens next?</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            After submission, your loan request will be put to a vote among group members. You'll be
                                                            notified once the voting period ends.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                            {formStep === 0 ? (
                                <Button type="button" className="w-full" onClick={nextStep} disabled={!form.formState.isValid}>
                                    Continue to Review
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full sm:w-auto order-2 sm:order-1"
                                        onClick={prevStep}
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4 sm:mr-2" />
                                        <span className="sm:inline">Back to Edit</span>
                                        <span className="inline sm:hidden">Back</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        className="w-full sm:w-auto order-1 sm:order-2"
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span className="sm:inline">Submitting...</span>
                                                <span className="inline sm:hidden">Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-1 h-4 w-4 sm:mr-2" />
                                                <span className="sm:inline">Submit Loan Request</span>
                                                <span className="inline sm:hidden">Submit</span>
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="calculator" className="space-y-4">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Loan Calculator</CardTitle>
                            <CardDescription>Calculate your loan payments and total cost</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Loan Amount</label>
                                        <div className="flex items-center mt-1.5">
                                            <div className="relative w-full max-w-[200px]">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">ZMK</span>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    value={watchAmount || ""}
                                                    onChange={(e) => form.setValue("amount", e.target.value)}
                                                    className="pl-12"
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Interest Rate (%)</label>
                                        <div className="flex items-center gap-4 mt-1.5">
                                            <div className="w-full max-w-[200px]">
                                                <Slider
                                                    min={0}
                                                    max={10}
                                                    step={0.5}
                                                    value={[watchInterestRate || 0]}
                                                    onValueChange={(value) => form.setValue("interestRate", value[0])}
                                                />
                                            </div>
                                            <span className="font-medium min-w-[40px] text-right">{watchInterestRate || 0}%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Number of Installments</label>
                                        <div className="flex items-center gap-4 mt-1.5">
                                            <div className="w-full max-w-[200px]">
                                                <Slider
                                                    min={1}
                                                    max={12}
                                                    step={1}
                                                    value={[watchInstallments || 1]}
                                                    onValueChange={(value) => form.setValue("installments", value[0])}
                                                />
                                            </div>
                                            <span className="font-medium min-w-[40px] text-right">{watchInstallments || 1}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/50 rounded-lg p-4 sm:p-6 space-y-4">
                                    <h3 className="font-medium">Payment Summary</h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Principal:</span>
                                            <span>{formatCurrency(watchAmount || 0)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Interest:</span>
                                            <span>
                        {formatCurrency(
                            watchAmount && watchInterestRate
                                ? Number.parseFloat(watchAmount) * (watchInterestRate / 100)
                                : 0,
                        )}
                      </span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between font-medium">
                                            <span>Total to Repay:</span>
                                            <span>
                        {formatCurrency(
                            watchAmount && watchInterestRate
                                ? Number.parseFloat(watchAmount) * (1 + watchInterestRate / 100)
                                : 0,
                        )}
                      </span>
                                        </div>

                                        <div className="flex justify-between text-primary font-medium">
                                            <span>Monthly Payment:</span>
                                            <span>{formatCurrency(monthlyPayment)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("details")}>
                                            Apply These Values
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {watchAmount && watchInstallments > 1 && (
                                <div className="pt-4">
                                    <h3 className="font-medium mb-3">Payment Schedule</h3>
                                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                                        <div className="border rounded-lg overflow-hidden min-w-[300px]">
                                            <div className="grid grid-cols-3 bg-muted/50 p-3 font-medium text-sm">
                                                <div>Payment</div>
                                                <div>Date</div>
                                                <div className="text-right">Amount</div>
                                            </div>
                                            <div className="divide-y">
                                                {Array.from({ length: watchInstallments }).map((_, i) => (
                                                    <div key={i} className="grid grid-cols-3 p-3 text-sm">
                                                        <div>Payment {i + 1}</div>
                                                        <div>
                                                            {watchRepaymentDate
                                                                ? format(addMonths(watchRepaymentDate, -watchInstallments + i + 1), "MMM d, yyyy")
                                                                : "TBD"}
                                                        </div>
                                                        <div className="text-right">{formatCurrency(monthlyPayment)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                            <CardDescription>Common questions about the loan request process</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full overflow-hidden">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How does the loan voting process work?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>
                                            When you submit a loan request, all members of your selected group will receive a notification.
                                            They'll have a set period (usually 7 days) to cast their vote. For your loan to be approved,
                                            you'll typically need a majority of votes in favor. You can track the voting progress in the "My
                                            Loan Requests" section.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger>What happens if my loan request is rejected?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>
                                            If your loan request is rejected, you'll receive a notification with the voting results. You can
                                            create a new request with different terms or amounts that might be more acceptable to the group.
                                            Consider discussing with group members beforehand to understand their concerns.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How is the interest rate determined?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>
                                            Each group has a recommended interest rate based on their policies. While you can propose a
                                            different rate, staying close to the recommended rate increases your chances of approval. Interest
                                            payments typically go back into the group's fund to benefit all members.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Can I repay my loan early?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>
                                            Yes, you can make early repayments without any penalties. In fact, early repayments are encouraged
                                            as they make funds available to other group members sooner. You can manage your repayments through
                                            the "My Active Loans" section.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-5">
                                    <AccordionTrigger>What should I include in my loan purpose?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>
                                            Be specific about how you plan to use the funds. Group members are more likely to approve loans
                                            for productive purposes like business investments, education, or necessary expenses. Include
                                            details on how this loan will benefit you and how you plan to generate the income to repay it.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => setActiveTab("details")}>
                                Back to Loan Form
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
