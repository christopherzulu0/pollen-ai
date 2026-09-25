"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  CreditCard,
  FileText,
  Home,
  PieChart,
  Plus,
  Settings,
  Wallet,
  ChevronRight,
  ChevronDown,
  Landmark,
  Coins,
  Gauge,
  LifeBuoy,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function SidebarNav() {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [openGroups, setOpenGroups] = useState(true)
  const [openReports, setOpenReports] = useState(false)

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" className="border-r border-border/40">
        <SidebarHeader className="py-4">
          <div className="flex items-center px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Landmark className="h-4 w-4" />
            </div>
            <span className="ml-2 font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              CoopFund
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={activeItem === "dashboard"}
                onClick={() => setActiveItem("dashboard")}
              >
                <Link href="#">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeItem === "loans"} onClick={() => setActiveItem("loans")}>
                <Link href="#">
                  <CreditCard className="h-4 w-4" />
                  <span>Loans</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeItem === "wallet"} onClick={() => setActiveItem("wallet")}>
                <Link href="#">
                  <Wallet className="h-4 w-4" />
                  <span>Wallet</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={activeItem === "analytics"}
                onClick={() => setActiveItem("analytics")}
              >
                <Link href="#">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Collapsible open={openGroups} onOpenChange={setOpenGroups} className="mt-6">
            <div className="px-3 mb-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer py-1">
                  <span>MY GROUPS</span>
                  {openGroups ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={true}>
                    <Link href="#">
                      <div className="relative">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Savings Group A" />
                          <AvatarFallback className="text-[10px]">SG</AvatarFallback>
                        </Avatar>
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <span>Savings Group A</span>
                      <Badge variant="outline" className="ml-auto text-xs py-0 h-5">
                        Admin
                      </Badge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Investment Club B" />
                        <AvatarFallback className="text-[10px]">IC</AvatarFallback>
                      </Avatar>
                      <span>Investment Club B</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Community Cooperative" />
                        <AvatarFallback className="text-[10px]">CC</AvatarFallback>
                      </Avatar>
                      <span>Community Cooperative</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Create New Group</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openReports} onOpenChange={setOpenReports} className="mt-6">
            <div className="px-3 mb-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer py-1">
                  <span>REPORTS & TOOLS</span>
                  {openReports ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <FileText className="h-4 w-4" />
                      <span>Financial Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <PieChart className="h-4 w-4" />
                      <span>Portfolio Analysis</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Gauge className="h-4 w-4" />
                      <span>Risk Assessment</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Coins className="h-4 w-4" />
                      <span>Loan Calculator</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarContent>
        <SidebarFooter className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <LifeBuoy className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarTrigger />
      </Sidebar>
    </SidebarProvider>
  )
}
