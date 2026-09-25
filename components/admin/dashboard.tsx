"use client"

import { BarChart, TrendingUp, FileText, Briefcase, Lightbulb, Users, ArrowUpRight, ArrowDownRight, Activity, Calendar, Filter, Download, TrendingDown, Clock, Eye, Search, Bell, Settings, Command, PieChart, LineChart, Zap, AlertCircle, CheckCircle2, Sparkles, Globe, Gauge } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from 'react'

interface StatCard {
  title: string
  value: string | number
  description: string
  trend?: { value: number; isPositive: boolean }
  icon: React.ReactNode
  color: "primary" | "secondary" | "accent"
  link?: string
  sparkline?: boolean
}

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const stats: StatCard[] = [
    {
      title: "Total Blog Posts",
      value: "24",
      description: "3 published this month",
      trend: { value: 12, isPositive: true },
      icon: <FileText className="w-5 h-5" />,
      color: "primary",
      link: "/admin/blog",
      sparkline: true,
    },
    {
      title: "Services",
      value: "8",
      description: "All services active",
      trend: { value: 5, isPositive: true },
      icon: <Briefcase className="w-5 h-5" />,
      color: "secondary",
      link: "/admin/services",
      sparkline: true,
    },
    {
      title: "Innovations",
      value: "12",
      description: "Technology features documented",
      trend: { value: 8, isPositive: true },
      icon: <Lightbulb className="w-5 h-5" />,
      color: "accent",
      link: "/admin/innovations",
      sparkline: true,
    },
    {
      title: "Testimonials",
      value: "156",
      description: "User success stories",
      trend: { value: 23, isPositive: true },
      icon: <Users className="w-5 h-5" />,
      color: "primary",
      link: "/admin/testimonials",
      sparkline: true,
    },
  ]

  const performanceMetrics = [
    { label: "API Response Time", value: "142ms", status: "optimal", icon: <Zap className="w-4 h-4" />, trend: -12 },
    { label: "System Uptime", value: "99.98%", status: "optimal", icon: <CheckCircle2 className="w-4 h-4" />, trend: 0.15 },
    { label: "Cache Hit Rate", value: "94.2%", status: "optimal", icon: <Gauge className="w-4 h-4" />, trend: 3.2 },
    { label: "Error Rate", value: "0.02%", status: "optimal", icon: <AlertCircle className="w-4 h-4" />, trend: -0.5 },
  ]

  const aiRecommendations = [
    {
      id: 1,
      title: "Optimize Blog Post #15",
      description: "This post has high bounce rate. Consider updating title and meta description.",
      action: "Review",
      confidence: 92,
      type: "warning"
    },
    {
      id: 2,
      title: "Trending Topic Alert",
      description: "Digital Finance is trending. Consider creating related content.",
      action: "Create",
      confidence: 87,
      type: "opportunity"
    },
    {
      id: 3,
      title: "Content Refresh",
      description: "Service page for Digital Loans needs 2-month old content refresh.",
      action: "Update",
      confidence: 78,
      type: "info"
    },
  ]

  const engagementHeatmap = [
    { day: "Mon", morning: 45, afternoon: 72, evening: 58 },
    { day: "Tue", morning: 52, afternoon: 68, evening: 64 },
    { day: "Wed", morning: 61, afternoon: 75, evening: 71 },
    { day: "Thu", morning: 48, afternoon: 70, evening: 62 },
    { day: "Fri", morning: 71, afternoon: 82, evening: 76 },
    { day: "Sat", morning: 38, afternoon: 55, evening: 48 },
    { day: "Sun", morning: 32, afternoon: 42, evening: 35 },
  ]

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">Intelligent content management with real-time analytics</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Last 30 Days</span>
                  <span className="sm:hidden">30 Days</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0 text-xs sm:text-sm">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Advanced Filter</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0 text-xs sm:text-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export Report</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <Button size="sm" className="gap-2 flex-shrink-0 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">+ Create</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <Command className="absolute left-3 top-3 h-5 w-5 text-muted-foreground opacity-50" />
                <Input 
                  placeholder="Search content, analytics, or ask AI..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gradient-to-r from-background/50 to-background/30 border-border/40 hover:border-secondary/30 focus:border-secondary/50 transition-all"
                />
              </div>
              {searchQuery && (
                <div className="absolute top-12 left-0 right-0 bg-background/95 backdrop-blur-xl border border-border/40 rounded-lg mt-2 p-3 space-y-2 z-50">
                  <p className="text-xs text-muted-foreground font-medium">AI Suggestions</p>
                  <button className="w-full text-left text-xs sm:text-sm p-2 hover:bg-background/50 rounded transition-colors break-words">Search blogs about "{searchQuery}"</button>
                  <button className="w-full text-left text-xs sm:text-sm p-2 hover:bg-background/50 rounded transition-colors break-words">Filter services by "{searchQuery}"</button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <Card 
                key={stat.title} 
                className="group border-border/40 hover:shadow-2xl hover:shadow-secondary/10 hover:border-secondary/50 transition-all duration-300 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedMetric(stat.title)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10 p-3 sm:p-4">
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</div>
                      {stat.trend && (
                        <div className={cn(
                          "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0",
                          stat.trend.isPositive ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-red-500/15 text-red-700 dark:text-red-400"
                        )}>
                          {stat.trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.trend.value}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "p-2 sm:p-3 rounded-xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0",
                    stat.color === "secondary" ? "bg-gradient-to-br from-secondary/20 to-secondary/5" : stat.color === "accent" ? "bg-gradient-to-br from-accent/20 to-accent/5" : "bg-gradient-to-br from-primary/20 to-primary/5"
                  )}>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-3 sm:p-4 pt-0">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Performance Card */}
          <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div >
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg mb-3">
                    <Gauge className="w-5 h-5 text-secondary " />
                    System Performance
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm ">Real-time infrastructure and API metrics</CardDescription>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 w-fit">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {performanceMetrics.map((metric) => (
                  <div key={metric.label} className="p-3 sm:p-4 bg-background/50 border border-border/40 rounded-lg hover:bg-background/70 hover:border-secondary/30 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                        {metric.icon}
                      </div>
                      <div className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0",
                        metric.trend >= 0 ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-red-500/15 text-red-700 dark:text-red-400"
                      )}>
                        {metric.trend >= 0 ? "+" : ""}{metric.trend}%
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-base sm:text-lg font-bold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-background/50 border border-border/40 grid w-full grid-cols-2 sm:grid-cols-4 p-1">
              <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
                <BarChart className="w-4 h-4 hidden sm:block flex-shrink-0" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="ai-insights" className="gap-2 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 hidden sm:block flex-shrink-0" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger value="engagement" className="gap-2 text-xs sm:text-sm">
                <PieChart className="w-4 h-4 hidden sm:block flex-shrink-0" />
                <span>Engagement</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2 text-xs sm:text-sm">
                <Activity className="w-4 h-4 hidden sm:block flex-shrink-0" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>


            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Activity className="w-5 h-5 text-secondary" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Latest updates with advanced filters</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs sm:text-sm w-fit">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        {
                          action: "Blog post published",
                          item: "How AI is Revolutionizing Credit Scoring",
                          time: "2 hours ago",
                          author: "Sarah Johnson",
                          color: "bg-primary/10 text-primary",
                          icon: <FileText className="w-4 h-4" />,
                          engagement: "+284 views"
                        },
                        {
                          action: "Testimonial added",
                          item: "Maria Tembo - Small Business Owner",
                          time: "5 hours ago",
                          author: "System",
                          color: "bg-secondary/10 text-secondary",
                          icon: <Users className="w-4 h-4" />,
                          engagement: "4.9★ rating"
                        },
                        {
                          action: "Service updated",
                          item: "Digital Loans - Features refreshed",
                          time: "1 day ago",
                          author: "Admin",
                          color: "bg-accent/10 text-accent",
                          icon: <Briefcase className="w-4 h-4" />,
                          engagement: "+127 views"
                        },
                        {
                          action: "Innovation milestone",
                          item: "Advanced AI Models released",
                          time: "2 days ago",
                          author: "Tech Team",
                          color: "bg-primary/10 text-primary",
                          icon: <Lightbulb className="w-4 h-4" />,
                          engagement: "+89 shares"
                        },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-background/30 border border-border/20 rounded-lg hover:bg-background/50 hover:border-secondary/30 transition-all duration-200 group">
                          <div className={cn("p-2 rounded-lg flex-shrink-0 transition-all", activity.color)}>
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-foreground">{activity.action}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.item}</p>
                              </div>
                              <span className="text-xs font-medium text-secondary whitespace-nowrap flex-shrink-0">{activity.engagement}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mt-2">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                {activity.time}
                              </p>
                              <p className="text-xs font-medium text-muted-foreground">{activity.author}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm h-fit">
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Lightbulb className="w-5 h-5 text-secondary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Create new content instantly</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                    {[
                      { label: "New Blog Post", icon: <FileText className="w-4 h-4" />, href: "/admin/blog", color: "primary" },
                      { label: "Add Service", icon: <Briefcase className="w-4 h-4" />, href: "/admin/services", color: "secondary" },
                      { label: "New Innovation", icon: <Lightbulb className="w-4 h-4" />, href: "/admin/innovations", color: "accent" },
                      { label: "Add Testimonial", icon: <Users className="w-4 h-4" />, href: "/admin/testimonials", color: "primary" },
                    ].map((action) => (
                      <Link key={action.label} href={action.href}>
                        <Button variant="outline" className="w-full justify-start hover:bg-secondary/5 hover:border-secondary/30 transition-all group text-xs sm:text-sm">
                          <span className="group-hover:text-secondary transition-colors flex-shrink-0">{action.icon}</span>
                          <span className="group-hover:text-secondary transition-colors truncate">{action.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Content Performance */}
              <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <LineChart className="w-5 h-5 text-secondary" />
                        Content Performance
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Engagement metrics with comparative analysis</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm w-fit">Detailed Report</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { name: "Blog", views: "12,450", engagement: "8.5%", icon: <FileText className="w-4 h-4" />, trend: 12 },
                      { name: "Services", views: "8,920", engagement: "6.2%", icon: <Briefcase className="w-4 h-4" />, trend: 5 },
                      { name: "Innovations", views: "5,670", engagement: "4.8%", icon: <Lightbulb className="w-4 h-4" />, trend: -2 },
                      { name: "Testimonials", views: "3,450", engagement: "12.3%", icon: <Users className="w-4 h-4" />, trend: 23 },
                    ].map((item) => (
                      <div key={item.name} className="flex flex-col p-3 sm:p-4 bg-background/50 border border-border/40 rounded-lg hover:bg-background/70 hover:border-secondary/30 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className={cn(
                            "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0",
                            item.trend >= 0 ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-red-500/15 text-red-700 dark:text-red-400"
                          )}>
                            {item.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(item.trend)}%
                          </div>
                        </div>
                        <p className="font-semibold text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Eye className="w-3 h-3" />
                          {item.views}
                        </p>
                        <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent mt-2">{item.engagement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="ai-insights" className="space-y-4 sm:space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* AI Recommendations */}
                <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Sparkles className="w-5 h-5 text-secondary" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Smart suggestions powered by machine learning</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                    {aiRecommendations.map((rec) => (
                      <div key={rec.id} className="p-3 sm:p-4 bg-background/50 border border-border/40 rounded-lg hover:bg-background/70 transition-all group">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-foreground">{rec.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 break-words">{rec.description}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="w-1 h-1 rounded-full bg-secondary" />
                            <span className="text-xs font-medium text-secondary">{rec.confidence}%</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full mt-3 text-xs hover:bg-secondary/10 hover:border-secondary/50">
                          {rec.action}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Insights Summary */}
                <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Globe className="w-5 h-5 text-secondary" />
                      Insights Summary
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Key analytics and opportunities</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                    {[
                      { title: "Peak Engagement Time", value: "Friday 2-4 PM", icon: <Clock className="w-4 h-4" /> },
                      { title: "Top Performing Content", value: "Digital Loans Blog", icon: <TrendingUp className="w-4 h-4" /> },
                      { title: "Content Gap", value: "Mobile Banking - Missing", icon: <AlertCircle className="w-4 h-4" /> },
                      { title: "User Retention", value: "84.2% (↑3.2%)", icon: <Users className="w-4 h-4" /> },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center gap-3 p-3 bg-background/30 rounded-lg border border-border/20">
                        <div className="p-2 rounded-lg bg-secondary/10 text-secondary flex-shrink-0">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{item.title}</p>
                          <p className="font-semibold text-xs sm:text-sm">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            <TabsContent value="engagement" className="space-y-4 sm:space-y-6 mt-6">
              <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <PieChart className="w-5 h-5 text-secondary" />
                    Engagement Heatmap
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">User activity patterns by time of day</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-4 overflow-x-auto">
                    {engagementHeatmap.map((row) => (
                      <div key={row.day} className="flex items-center gap-3 sm:gap-4">
                        <span className="text-xs sm:text-sm font-medium w-10 flex-shrink-0">{row.day}</span>
                        <div className="flex-1 flex gap-2 min-w-0">
                          {[
                            { val: row.morning, label: "Morning", max: 100 },
                            { val: row.afternoon, label: "Afternoon", max: 100 },
                            { val: row.evening, label: "Evening", max: 100 },
                          ].map((slot) => (
                            <div key={slot.label} className="flex-1 h-6 sm:h-8 rounded-lg bg-background/30 border border-border/20 overflow-hidden group relative">
                              <div 
                                className="h-full bg-gradient-to-r from-secondary/60 to-secondary transition-all duration-300"
                                style={{ width: `${(slot.val / slot.max) * 100}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {slot.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="activity" className="space-y-4 sm:space-y-6 mt-6">
              <Card className="border-border/40 bg-gradient-to-br from-background to-background/40 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Detailed Activity Feed</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Real-time actions with detailed information</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center flex-shrink-0 border border-secondary/20">
                          <span className="text-xs font-semibold text-secondary">U{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs sm:text-sm">Content activity #{i + 1}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">User interaction and system event tracking</p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago • IP: 192.168.1.{i}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs flex-shrink-0">Details</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
