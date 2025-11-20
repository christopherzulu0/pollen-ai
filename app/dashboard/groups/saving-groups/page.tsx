'use client'

import {Suspense, useEffect, useState} from "react"
import { useSearchParams } from "next/navigation"
import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoanRequestForm from "@/components/loans/loan-request-form"
import PendingLoanRequests from "@/components/loans/pending-loan-requests"
import MyLoanRequests from "@/components/loans/my-loan-requests"
import MembersWithLoans from "@/components/loans/members-with-loans"
import GroupMembers from "@/components/loans/group-members"
import DashboardHeader from "@/components/loans/dashboard-header"
import FinancialMetrics from "@/components/loans/financial-metrics"
import ActivityFeed from "@/components/loans/activity-feed"
import LoanStatistics from "@/components/loans/loan-statistics"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileNav } from "@/components/loans/mobile-nav"
import { CommandMenu } from "@/components/loans/command-menu"
import { AIAssistant } from "@/components/loans/ai-assistant"
import { Toaster } from "@/components/ui/toaster"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "@/components/loans/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// export const metadata: Metadata = {
//     title: "Cooperative Loan Management",
//     description: "Manage loan requests, approvals, and repayments for your cooperative groups",
//     viewport: "width=device-width, initial-scale=1, maximum-scale=1",
// }

export default function LoansPage() {
    const searchParams = useSearchParams()
    const [isClient,setIsClient] = useState(false)
    const groupId = searchParams.get('groupId')

    useEffect(()=>{
        setIsClient(true);
    },[])

    if(!isClient){
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col  ">
            {/*<DashboardHeader />*/}
            {/*<CommandMenu />*/}
            {/*<MobileNav />*/}

            <div className="flex-1 flex">
                {/*<div className="hidden md:block">*/}
                {/*    <SidebarNav />*/}
                {/*</div>*/}
                <main className="flex-1 pb-20 md:pb-0">
                    <div className="container py-4 md:py-8 lg:py-10 max-w-7xl px-4 sm:px-6">
                        <div className="grid gap-4 md:gap-6 lg:gap-8">
                            <div className="col-span-1">
                                <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                                    <FinancialMetrics />
                                </Suspense>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-6 lg:gap-8">
                                <div className="col-span-1 md:col-span-5">
                                    <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}>
                                        <LoanStatistics />
                                    </Suspense>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                                        <ActivityFeed />
                                    </Suspense>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-8">
                            <Tabs defaultValue={groupId ? "new-request" : "pending"} className="w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4 sm:gap-0">
                                    <ScrollArea className="w-full max-w-full sm:max-w-3xl whitespace-nowrap pb-3 sm:pb-0">
                                        <TabsList className="inline-flex h-auto p-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <TabsTrigger
                                                value="pending"
                                                className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-100 dark:data-[state=active]:text-slate-900"
                                            >
                                                Pending Requests
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="my-requests"
                                                className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-100 dark:data-[state=active]:text-slate-900"
                                            >
                                                My Requests
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="outstanding"
                                                className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-100 dark:data-[state=active]:text-slate-900"
                                            >
                                                Outstanding Loans
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="members"
                                                className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-100 dark:data-[state=active]:text-slate-900"
                                            >
                                                Group Members
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="new-request"
                                                className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-100 dark:data-[state=active]:text-slate-900"
                                            >
                                                New Request
                                            </TabsTrigger>
                                        </TabsList>
                                    </ScrollArea>
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white hidden md:flex"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Request
                                    </Button>
                                </div>

                                <TabsContent value="pending" className="space-y-4 mt-0">
                                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                                        <PendingLoanRequests />
                                    </Suspense>
                                </TabsContent>

                                <TabsContent value="my-requests" className="space-y-4 mt-0">
                                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                                        <MyLoanRequests />
                                    </Suspense>
                                </TabsContent>

                                <TabsContent value="outstanding" className="space-y-4 mt-0">
                                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                                        <MembersWithLoans />
                                    </Suspense>
                                </TabsContent>

                                <TabsContent value="members" className="space-y-4 mt-0">
                                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                                        <GroupMembers />
                                    </Suspense>
                                </TabsContent>

                                <TabsContent value="new-request" className="space-y-4 mt-0">
                                    <LoanRequestForm preSelectedGroupId={groupId || undefined} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
            <AIAssistant />
            <Toaster />
        </div>
    )
}
