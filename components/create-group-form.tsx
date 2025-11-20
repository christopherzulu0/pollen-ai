"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  ArrowRight,
  Check,
  Edit2,
  Upload,
  Users,
  DollarSign,
  Shield,
  FileText,
  Mail,
  Lock,
  Settings,
  Percent,
  Loader2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@clerk/nextjs"

import { UploadDropzone } from "@uploadthing/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useUploadThing } from "@/lib/uploadthing-react"

// Form schema
const formSchema = z.object({
  groupName: z.string().min(3, { message: "Group name must be at least 3 characters" }),
  description: z.string().optional(),
  govType: z.enum(["admin", "multi-admin", "one-vote-per-person", "one-vote-deposit"]),
  adminPhone1: z.string().optional(),
  adminPhone2: z.string().optional(),
  depositGoal: z.string().optional(),
  latePenaltyFee: z.string().optional(),
  meetingFrequency: z.enum(["weekly", "bi-weekly", "monthly"]).optional(),
  enableNotifications: z.boolean().default(true),
  maxMembers: z.string().optional(),
  groupLogo: z.string().optional(),
  // New advanced fields
  contributionAmount: z.string().optional(),
  contributionFrequency: z.enum(["weekly", "bi-weekly", "monthly"]).optional(),
  interestRate: z.string().optional(),
  groupPrivacy: z.enum(["public", "private", "invite-only"]).default("private"),
  allowEarlyWithdrawal: z.boolean().default(false),
  earlyWithdrawalFee: z.string().optional(),
  requireApproval: z.boolean().default(true),
  autoReminders: z.boolean().default(true),
  gracePeriod: z.string().default("3"),
  bylaws: z.string().optional(),
  groupRules: z.string().optional(),
  votingThreshold: z.string().default("50"),
  allowLateJoining: z.boolean().default(true),
  groupDuration: z.string().optional(),
  groupTags: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateGroupForm() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast()
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState<"basic" | "governance" | "financial" | "settings" | "rules" | "review">("basic")
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { startUpload } = useUploadThing("groupLogo")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      description: "",
      govType: "admin",
      adminPhone1: "",
      adminPhone2: "",
      depositGoal: "",
      latePenaltyFee: "",
      meetingFrequency: "weekly",
      enableNotifications: true,
      maxMembers: "20",
      groupLogo: "",
      contributionAmount: "100",
      contributionFrequency: "monthly",
      interestRate: "5",
      groupPrivacy: "private",
      allowEarlyWithdrawal: false,
      earlyWithdrawalFee: "10",
      requireApproval: true,
      autoReminders: true,
      gracePeriod: "3",
      bylaws: "",
      groupRules: "",
      votingThreshold: "50",
      allowLateJoining: true,
      groupDuration: "12",
      groupTags: "savings, cooperative",
    },
  })

  const govType = form.watch("govType")
  const allowEarlyWithdrawal = form.watch("allowEarlyWithdrawal")

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploadingLogo(true);
    setUploadProgress(0);
    setError("");
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const file = e.target.files[0];
      const uploadedFiles = await startUpload([file]);
      
      if (uploadedFiles && uploadedFiles[0]) {
        setUploadProgress(100);
        const url = uploadedFiles[0].url;
        setLogoUrl(url);
        form.setValue("groupLogo", url);
      toast({
          title: "Logo uploaded successfully",
          description: "Your group logo has been uploaded.",
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload logo");
      toast({
        title: "Error uploading logo",
        description: err instanceof Error ? err.message : "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploadingLogo(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const getNextStep = (currentStep: string) => {
    switch (currentStep) {
      case "basic":
        return "governance";
      case "governance":
        return "financial";
      case "financial":
        return "settings";
      case "settings":
        return "rules";
      case "rules":
        return "review";
      default:
        return "basic";
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (currentStep === "review") {
        setIsSubmitting(true);
        console.log("Submitting to:", "/api/groups");
        
        const formData = {
          name: data.groupName,
          description: data.description || "",
          logo: logoUrl || "",
          privacy: "PRIVATE",
          governanceType: "ONE_VOTE_PER_PERSON",
          contributionAmount: Number(data.contributionAmount) || 0,
          contributionFrequency: "MONTHLY",
          depositGoal: Number(data.depositGoal) || 0,
          latePenaltyFee: Number(data.latePenaltyFee) || 0,
          gracePeriod: Number(data.gracePeriod) || 3,
          interestRate: Number(data.interestRate) || 0,
          allowEarlyWithdrawal: data.allowEarlyWithdrawal,
          earlyWithdrawalFee: Number(data.earlyWithdrawalFee) || 0,
          requireApproval: data.requireApproval,
          autoReminders: data.autoReminders,
          votingThreshold: Number(data.votingThreshold) || 50,
          allowLateJoining: data.allowLateJoining,
          groupDuration: Number(data.groupDuration) || 12,
          maxMembers: Number(data.maxMembers) || 20,
          meetingFrequency: "WEEKLY",
          groupRules: data.groupRules || "",
          bylaws: data.bylaws || "",
          tags: data.groupTags || "",
        };
        
        console.log("Form data:", formData);
        
        const response = await fetch("/api/groups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const error = await response.json();
          console.error("API error response:", error);
          throw new Error(error.message || "Failed to create group");
        }

        const result = await response.json();
        console.log("API success response:", result);

        toast({
          title: "Success",
          description: "Group created successfully!",
        });
        
        form.reset();
        setCurrentStep("basic");
        router.push("/dashboard?tab=groups");
      } else {
        setCurrentStep(getNextStep(currentStep));
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "governance") {
      setCurrentStep("basic")
    } else if (currentStep === "financial") {
      setCurrentStep("governance")
    } else if (currentStep === "settings") {
      setCurrentStep("financial")
    } else if (currentStep === "rules") {
      setCurrentStep("settings")
    } else if (currentStep === "review") {
      setCurrentStep("rules")
    }
  }

  const handleEdit = (editStep: "basic" | "governance" | "financial" | "settings" | "rules") => {
    setCurrentStep(editStep)
  }

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg ">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
        <CardTitle className="text-2xl">Create a Cooperative Group</CardTitle>
        <CardDescription className="text-teal-100">Set up your group structure and governance model</CardDescription>
      </CardHeader>
      <div className="border-b">
        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic" disabled>
              Basic
            </TabsTrigger>
            <TabsTrigger value="governance" disabled>
              Governance
            </TabsTrigger>
            <TabsTrigger value="financial" disabled>
              Financial
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
            <TabsTrigger value="rules" disabled>
              Rules
            </TabsTrigger>
            <TabsTrigger value="review" disabled>
              Review
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="p-6 pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === "basic" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="groupLogo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormLabel>Group Logo</FormLabel>
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage 
                            src={logoUrl || "/placeholder.svg?height=96&width=96"} 
                            alt="Group logo" 
                          />
                          <AvatarFallback>GL</AvatarFallback>
                    </Avatar>
                        {uploadingLogo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <div className="text-white text-sm">{uploadProgress}%</div>
                  </div>
                        )}
                </div>
                      <div className="flex flex-col items-center space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                          {uploadingLogo ? "Uploading..." : "Upload Logo"}
                        </label>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <p className="text-sm text-muted-foreground">
                          Upload a logo for your group (optional)
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter group name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose of your group"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Briefly describe what this group is about</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="maxMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Members</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="20" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set a limit for the number of members (leave empty for unlimited)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groupDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Duration (months)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="12" {...field} />
                        </FormControl>
                        <FormDescription>How long will this group be active?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="groupPrivacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Privacy</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select privacy level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Public (Anyone can find and request to join)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              <span>Private (Only visible with link or code)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="invite-only">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>Invite Only (Admin must invite members)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Control who can see and join your group</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="savings, cooperative, community" {...field} />
                      </FormControl>
                      <FormDescription>Add tags to help others find your group (comma separated)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === "governance" && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                    <Shield className="h-5 w-5 text-teal-600" />
                    Governance Structure
                  </h3>
                  <p className="text-sm text-slate-600">Choose how decisions will be made in your cooperative group</p>
                </div>

                <FormField
                  control={form.control}
                  name="govType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governance Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select governance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="multi-admin">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Multi-Admin</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="one-vote-per-person">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>1 Vote per Person</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="one-vote-deposit">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>1 Vote per Deposit</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {govType === "admin" && "Single administrator manages the group"}
                        {govType === "multi-admin" && "Multiple administrators share management responsibilities"}
                        {govType === "one-vote-per-person" && "Each member gets one equal vote on decisions"}
                        {govType === "one-vote-deposit" && "Voting power is proportional to deposits made"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  {govType === "multi-admin" && (
                    <>
                      <FormField
                        control={form.control}
                        name="adminPhone1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Phone Number 1*</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adminPhone2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Phone Number 2*</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="votingThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Voting Threshold (%)</FormLabel>
                        <span className="text-sm font-medium">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          defaultValue={[Number.parseInt(field.value)]}
                          max={100}
                          step={5}
                          onValueChange={(vals) => field.onChange(vals[0].toString())}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>Percentage of votes required to pass a decision</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Membership Approval</FormLabel>
                        <FormDescription>Administrators must approve new member requests</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowLateJoining"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Late Joining</FormLabel>
                        <FormDescription>Members can join after the group has started</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === "financial" && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                    <DollarSign className="h-5 w-5 text-teal-600" />
                    Financial Settings
                  </h3>
                  <p className="text-sm text-slate-600">Configure the financial aspects of your cooperative group</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contributionAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contribution Amount*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input className="pl-10" placeholder="100" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Regular contribution amount per member</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contributionFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contribution Frequency*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often members contribute</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="depositGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Goal*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                          <Input className="pl-10" placeholder="Enter deposit goal amount" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Target amount for the group to save</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="latePenaltyFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Penalty Fee*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input className="pl-10" placeholder="Enter late penalty fee amount" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Fee charged for late payments</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gracePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace Period (days)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormDescription>Days allowed after due date before penalty</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <span className="text-sm font-medium">{field.value}%</span>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Percent className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                          <Input className="pl-10" placeholder="5" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Interest rate for loans or savings</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowEarlyWithdrawal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Early Withdrawals</FormLabel>
                        <FormDescription>Members can withdraw funds before the end date</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {allowEarlyWithdrawal && (
                  <FormField
                    control={form.control}
                    name="earlyWithdrawalFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Early Withdrawal Fee (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Percent className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input className="pl-10" placeholder="10" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Percentage fee for early withdrawals</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {currentStep === "settings" && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                    <Settings className="h-5 w-5 text-teal-600" />
                    Group Settings
                  </h3>
                  <p className="text-sm text-slate-600">Configure additional settings for your cooperative group</p>
                </div>

                <FormField
                  control={form.control}
                  name="meetingFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Frequency*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meeting frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How often the group will meet</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Notifications</FormLabel>
                          <FormDescription>Receive updates about group activities</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Automatic Reminders</FormLabel>
                          <FormDescription>Send payment reminders to members</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 font-medium">Communication Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" defaultChecked />
                      <label
                        htmlFor="email-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms-notifications" defaultChecked />
                      <label
                        htmlFor="sms-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        SMS Notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-app-notifications" defaultChecked />
                      <label
                        htmlFor="in-app-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In-App Notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 font-medium">Default Notification Events</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="payment-due" defaultChecked />
                      <label
                        htmlFor="payment-due"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Payment Due
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="payment-received" defaultChecked />
                      <label
                        htmlFor="payment-received"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Payment Received
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="new-member" defaultChecked />
                      <label
                        htmlFor="new-member"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New Member Joined
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="meeting-reminder" defaultChecked />
                      <label
                        htmlFor="meeting-reminder"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Meeting Reminder
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "rules" && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Group Rules & Bylaws
                  </h3>
                  <p className="text-sm text-slate-600">
                    Define the rules and bylaws that govern your cooperative group
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="groupRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Rules</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the rules for your group..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Define the basic rules that all members must follow</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bylaws"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Bylaws</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the formal bylaws for your group..."
                          className="min-h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Formal bylaws that govern the operation of your cooperative</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 font-medium">Default Rules Templates</h3>
                  <p className="mb-4 text-sm text-slate-600">
                    Select a template to quickly add common rules to your group
                  </p>
                  <RadioGroup defaultValue="custom" className="space-y-4">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="savings" id="savings" />
                      <label htmlFor="savings" className="text-sm font-medium">
                        Savings Group Rules
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="lending" id="lending" />
                      <label htmlFor="lending" className="text-sm font-medium">
                        Lending Circle Rules
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="investment" id="investment" />
                      <label htmlFor="investment" className="text-sm font-medium">
                        Investment Club Rules
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="custom" id="custom" />
                      <label htmlFor="custom" className="text-sm font-medium">
                        Custom Rules (Write your own)
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-medium">Common Rules Examples</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <ul className="space-y-2 pl-6 text-slate-600">
                        <li>All members must make regular contributions on time</li>
                        <li>Members must attend scheduled meetings</li>
                        <li>Late payments are subject to penalties</li>
                        <li>Decisions require majority vote approval</li>
                        <li>Members must maintain confidentiality of group discussions</li>
                        <li>Early withdrawals may be subject to fees</li>
                        <li>Members must provide notice before leaving the group</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-teal-50 p-4 text-teal-800">
                  <h3 className="mb-2 flex items-center gap-2 font-medium">
                    <Check className="h-5 w-5" />
                    Review Your Group Details
                  </h3>
                  <p className="text-sm">Please review all information before creating your group</p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">Basic Information</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-teal-600 hover:text-teal-700"
                        onClick={() => handleEdit("basic")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Group Name:</span>
                        <span className="col-span-2">{form.getValues("groupName")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Description:</span>
                        <span className="col-span-2">{form.getValues("description") || "—"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Max Members:</span>
                        <span className="col-span-2">{form.getValues("maxMembers") || "Unlimited"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Group Duration:</span>
                        <span className="col-span-2">{form.getValues("groupDuration")} months</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Privacy:</span>
                        <span className="col-span-2">
                          {form.getValues("groupPrivacy") === "public" && "Public"}
                          {form.getValues("groupPrivacy") === "private" && "Private"}
                          {form.getValues("groupPrivacy") === "invite-only" && "Invite Only"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">Governance</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-teal-600 hover:text-teal-700"
                        onClick={() => handleEdit("governance")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Governance Type:</span>
                        <span className="col-span-2">
                          {form.getValues("govType") === "admin" && "Admin"}
                          {form.getValues("govType") === "multi-admin" && "Multi-Admin"}
                          {form.getValues("govType") === "one-vote-per-person" && "1 Vote per Person"}
                          {form.getValues("govType") === "one-vote-deposit" && "1 Vote per Deposit"}
                        </span>
                      </div>

                      {form.getValues("govType") === "multi-admin" && (
                        <>
                          <div className="grid grid-cols-3 gap-1">
                            <span className="font-medium text-slate-500">Admin Phone 1:</span>
                            <span className="col-span-2">{form.getValues("adminPhone1")}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <span className="font-medium text-slate-500">Admin Phone 2:</span>
                            <span className="col-span-2">{form.getValues("adminPhone2")}</span>
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Voting Threshold:</span>
                        <span className="col-span-2">{form.getValues("votingThreshold")}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Require Approval:</span>
                        <span className="col-span-2">{form.getValues("requireApproval") ? "Yes" : "No"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Allow Late Joining:</span>
                        <span className="col-span-2">{form.getValues("allowLateJoining") ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">Financial</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-teal-600 hover:text-teal-700"
                        onClick={() => handleEdit("financial")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Contribution Amount:</span>
                        <span className="col-span-2">${form.getValues("contributionAmount")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Contribution Frequency:</span>
                        <span className="col-span-2">
                          {form.getValues("contributionFrequency") === "weekly" && "Weekly"}
                          {form.getValues("contributionFrequency") === "bi-weekly" && "Bi-Weekly"}
                          {form.getValues("contributionFrequency") === "monthly" && "Monthly"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Deposit Goal:</span>
                        <span className="col-span-2">${form.getValues("depositGoal")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Late Penalty Fee:</span>
                        <span className="col-span-2">${form.getValues("latePenaltyFee")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Grace Period:</span>
                        <span className="col-span-2">{form.getValues("gracePeriod")} days</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Interest Rate:</span>
                        <span className="col-span-2">{form.getValues("interestRate")}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Allow Early Withdrawal:</span>
                        <span className="col-span-2">{form.getValues("allowEarlyWithdrawal") ? "Yes" : "No"}</span>
                      </div>
                      {form.getValues("allowEarlyWithdrawal") && (
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium text-slate-500">Early Withdrawal Fee:</span>
                          <span className="col-span-2">{form.getValues("earlyWithdrawalFee")}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">Settings</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-teal-600 hover:text-teal-700"
                        onClick={() => handleEdit("settings")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Meeting Frequency:</span>
                        <span className="col-span-2">
                          {form.getValues("meetingFrequency") === "weekly" && "Weekly"}
                          {form.getValues("meetingFrequency") === "bi-weekly" && "Bi-Weekly"}
                          {form.getValues("meetingFrequency") === "monthly" && "Monthly"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Notifications:</span>
                        <span className="col-span-2">
                          {form.getValues("enableNotifications") ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Auto Reminders:</span>
                        <span className="col-span-2">{form.getValues("autoReminders") ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">Rules & Bylaws</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-teal-600 hover:text-teal-700"
                        onClick={() => handleEdit("rules")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Group Rules:</span>
                        <span className="col-span-2">{form.getValues("groupRules") || "—"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-slate-500">Bylaws:</span>
                        <span className="col-span-2">{form.getValues("bylaws") || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {currentStep !== "basic" ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                type="submit"
                className="gap-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Group...
                  </>
                ) : currentStep === "review" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Create Group
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      {currentStep !== "review" && (
        <CardFooter className="flex justify-between border-t bg-slate-50 p-4 text-xs text-slate-500">
          <p>
            Step{" "}
            {currentStep === "basic"
              ? "1"
              : currentStep === "governance"
                ? "2"
                : currentStep === "financial"
                  ? "3"
                  : currentStep === "settings"
                    ? "4"
                    : "5"}{" "}
            of 5
          </p>
          <p>All fields marked with * are required</p>
        </CardFooter>
      )}
    </Card>
  )
}
