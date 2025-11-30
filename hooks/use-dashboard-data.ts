"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

// Types for dashboard data
export interface DashboardStats {
  totalSavings: number
  savingsChange: number
  activeGroups: number
  newGroupsThisMonth: number
  upcomingPayments: number
  paymentsDueThisWeek: number
  totalMembers: number
  newMembersThisMonth: number
}

export interface ChartData {
  depositData: Array<{ name: string; amount: number }>
  membershipData: Array<{ name: string; value: number }>
  activityData: Array<{ date: string; deposits: number; withdrawals: number }>
}

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  time: string
  group: string
}

export interface RecentActivity {
  id: string
  type: 'deposit' | 'withdrawal' | 'member_joined' | 'info'
  amount?: number
  date: string
  group: string
  user: string
}

export interface ActivitiesData {
  upcomingEvents: UpcomingEvent[]
  recentActivities: RecentActivity[]
}

// Default fallback data
const DEFAULT_STATS: DashboardStats = {
  totalSavings: 0,
  savingsChange: 0,
  activeGroups: 0,
  newGroupsThisMonth: 0,
  upcomingPayments: 0,
  paymentsDueThisWeek: 0,
  totalMembers: 0,
  newMembersThisMonth: 0,
}

const DEFAULT_CHART_DATA: ChartData = {
  depositData: [
    { name: "Jan", amount: 0 },
    { name: "Feb", amount: 0 },
    { name: "Mar", amount: 0 },
    { name: "Apr", amount: 0 },
    { name: "May", amount: 0 },
    { name: "Jun", amount: 0 },
  ],
  membershipData: [{ name: "No Groups", value: 1 }],
  activityData: [
    { date: "Week 1", deposits: 0, withdrawals: 0 },
    { date: "Week 2", deposits: 0, withdrawals: 0 },
    { date: "Week 3", deposits: 0, withdrawals: 0 },
    { date: "Week 4", deposits: 0, withdrawals: 0 },
    { date: "Week 5", deposits: 0, withdrawals: 0 },
  ],
}

const DEFAULT_ACTIVITIES: ActivitiesData = {
  upcomingEvents: [{
    id: "welcome",
    title: "Welcome to Pollen!",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: "—",
    group: "Getting Started",
  }],
  recentActivities: [{
    id: "welcome-activity",
    type: "info",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    group: "Pollen",
    user: "Welcome! Start by joining a group.",
  }],
}

// Fetch functions with error handling
async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch('/api/dashboard/stats')
    
    if (!response.ok) {
      console.warn('Dashboard stats API returned error, using defaults')
      return DEFAULT_STATS
    }
    
    const data = await response.json()
    
    if (!data.success) {
      console.warn('Dashboard stats not successful:', data.message)
      return DEFAULT_STATS
    }
    
    return data.data
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return DEFAULT_STATS
  }
}

async function fetchChartData(): Promise<ChartData> {
  try {
    const response = await fetch('/api/dashboard/charts')
    
    if (!response.ok) {
      console.warn('Chart data API returned error, using defaults')
      return DEFAULT_CHART_DATA
    }
    
    const data = await response.json()
    
    if (!data.success) {
      console.warn('Chart data not successful:', data.message)
      return DEFAULT_CHART_DATA
    }
    
    return data.data
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
    return DEFAULT_CHART_DATA
  }
}

async function fetchActivities(): Promise<ActivitiesData> {
  try {
    const response = await fetch('/api/dashboard/activities')
    
    if (!response.ok) {
      console.warn('Activities API returned error, using defaults')
      return DEFAULT_ACTIVITIES
    }
    
    const data = await response.json()
    
    if (!data.success) {
      console.warn('Activities not successful:', data.message)
      return DEFAULT_ACTIVITIES
    }
    
    return data.data
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return DEFAULT_ACTIVITIES
  }
}

// React Query hooks (standard)
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

export function useChartData() {
  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: fetchChartData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

export function useActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 2, // 2 minutes (activities update more frequently)
    refetchOnWindowFocus: true,
  })
}

// Suspense-enabled hooks
export function useDashboardStatsSuspense() {
  return useSuspenseQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5,
  })
}

export function useChartDataSuspense() {
  return useSuspenseQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: fetchChartData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useActivitiesSuspense() {
  return useSuspenseQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 2,
  })
}

// Prefetch functions for SSR
export const dashboardQueryKeys = {
  stats: ['dashboard', 'stats'] as const,
  charts: ['dashboard', 'charts'] as const,
  activities: ['dashboard', 'activities'] as const,
}

export const dashboardQueryFns = {
  stats: fetchDashboardStats,
  charts: fetchChartData,
  activities: fetchActivities,
}

