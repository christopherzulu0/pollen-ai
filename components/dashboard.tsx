"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  Plus,
  LogIn,
  Settings,
  HelpCircle,
  Bell,
  BarChart3,
  Calendar,
  LogOut,
  User,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  Search,
  Wallet,
  PiggyBank,
  Clock,
  Download,
  FileText,
  Moon,
  Sun,
  Menu,
  Loader2,
  CreditCard,
  ChevronDown,
} from "lucide-react"
import CreateGroupForm from "@/components/create-group-form"
import DashboardOverview from "@/components/dashboard-overview"
import JoinGroup from "@/components/join-group"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useQuery } from "@tanstack/react-query"
import { PersonalSavingsTab } from "./dashboard/features/personal-savings/personal-savings-tab"
import ViewBalances from "./ViewBalances"
import DepositWithdraw from "./DepositWithdraw"
import Payments from "./Payments"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { UserButton } from "@clerk/nextjs"

// Define Group type
interface Group {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  contributionAmount: number;
  memberships?: { id: string }[];
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<number>(3)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Simulate loading state
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch groups data with React Query
  const { 
    data: groups = [] as Group[], 
    isLoading: isLoadingGroups,
    error: groupsError,
    refetch: refetchGroups,
    isError
  } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      console.log('Fetching groups...');
      try {
        const response = await fetch('/api/groups');
        console.log('Groups API response status:', response.status);

        // Handle HTTP error statuses
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in again.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch groups');
        }

        const data = await response.json();
        console.log('Groups data:', data);
        return data;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  // Refetch groups when pathname changes to groups
  useEffect(() => {
    if (pathname === '/dashboard/groups') {
      console.log('Path changed to groups, refreshing data...');
      refetchGroups();
    }
  }, [pathname, refetchGroups]);

  // Show error toast if groups fetch fails
  useEffect(() => {
    if (isError && groupsError) {
      console.error('Error fetching groups:', groupsError);
      toast({
        title: "Error loading groups",
        description: groupsError instanceof Error ? groupsError.message : "Failed to load groups. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, groupsError, toast]);

  const handleNotificationClick = () => {
    toast({
      title: "Notifications cleared",
      description: "You have no new notifications",
    })
    setNotifications(0)
  }

  const renderHeader = () => (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center justify-between border-b bg-background px-3 sm:px-6">
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard" passHref>
                    <SidebarMenuButton
                      isActive={pathname === "/dashboard"}
                    >
                      <Home className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-white" />
                      <span className="text-sm">Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/dashboard/groups" passHref>
                    <SidebarMenuButton
                      isActive={pathname === "/dashboard/groups"}
                    >
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-white" />
                      <span className="text-sm">Groups</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <div className="flex items-center gap-2">
        {!isMobile && <SidebarTrigger />}
        <h2 className="text-lg sm:text-xl font-bold truncate">Pollen</h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search Button - Hidden on very small screens */}
        <div className="hidden xs:block">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 sm:h-9 w-8 sm:w-9">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] sm:w-[320px] p-0" align="end">
              <div className="flex items-center border-b p-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input placeholder="Search..." className="border-0 p-1 shadow-none focus-visible:ring-0 text-sm" autoFocus />
              </div>
              <div className="p-2">
                <p className="p-2 text-xs text-muted-foreground">Recent searches</p>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-xs">
                    <Users className="mr-2 h-3 w-3" />
                    Community Savings Circle
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-xs">
                    <Calendar className="mr-2 h-3 w-3" />
                    Payment Schedule
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 sm:h-9 w-8 sm:w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {isMounted && (
                  theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 sm:h-9 w-8 sm:w-9 relative" onClick={handleNotificationClick}>
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[8px] sm:text-[10px] text-white font-bold">
                  {notifications}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] sm:w-[320px] p-0" align="end">
            <div className="flex items-center justify-between border-b p-2 sm:p-3">
              <h4 className="font-medium text-sm">Notifications</h4>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                Mark all as read
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-1 p-1">
                <div className="flex items-start gap-2 sm:gap-3 rounded-md p-2 sm:p-3 hover:bg-muted">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">New member joined your group</p>
                    <p className="text-xs text-muted-foreground truncate">Sarah Johnson joined Community Savings Circle</p>
                    <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 rounded-md p-2 sm:p-3 hover:bg-muted">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Payment reminder</p>
                    <p className="text-xs text-muted-foreground truncate">Your monthly contribution of $100 is due in 3 days</p>
                    <p className="mt-1 text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 rounded-md p-2 sm:p-3 hover:bg-muted">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Deposit successful</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Your deposit of $200 to Personal Savings was successful
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="border-t p-2 sm:p-3">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 sm:h-9 w-8 sm:w-9 rounded-full p-0">
              <Avatar className="h-8 sm:h-9 w-8 sm:w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="John Doe" />
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs sm:text-sm">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs sm:text-sm">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs sm:text-sm">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )

  return (
    <div className="flex h-screen w-full bg-background">
      <SidebarProvider>
        {!isMobile && (
          <Sidebar className="border-r bg-white dark:bg-gray-900">
            <SidebarHeader className="pb-0">
              <div className="flex items-center gap-2 px-2 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-none tracking-tight text-gray-500 dark:text-white">Pollen</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Financial Cooperative</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* Overview Group */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-500 dark:text-white">Overview</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/dashboard" passHref>
                        <SidebarMenuButton isActive={pathname === "/dashboard"}>
                          <Home className="h-5 w-5 text-gray-500 dark:text-white" />
                          <span className="text-gray-500 dark:text-white">Dashboard</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/dashboard/notifications" passHref>
                        <SidebarMenuButton
                          isActive={pathname === "/dashboard/notifications"}
                        >
                          <Bell className="h-5 w-5 text-gray-500 dark:text-white" />
                          <span className="text-gray-500 dark:text-white">Notifications</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Finances Group */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-500 dark:text-white">Finances</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/dashboard/personal-savings" passHref>
                        <SidebarMenuButton
                          isActive={pathname === "/dashboard/personal-savings"}
                        >
                          <Wallet className="h-5 w-5 text-gray-500 dark:text-white" />
                          <span className="text-gray-500 dark:text-white">Personal Savings</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/dashboard/view-balances" passHref>
                        <SidebarMenuButton
                          isActive={pathname === "/dashboard/view-balances"}
                        >
                          <BarChart3 className="h-5 w-5 text-gray-500 dark:text-white" />
                          <span className="text-gray-500 dark:text-white">View Balances</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/dashboard/payments" passHref>
                        <SidebarMenuButton isActive={pathname === "/dashboard/payments"}>
                          <Calendar className="h-5 w-5 text-gray-500 dark:text-white" />
                          <span className="text-gray-500 dark:text-white">Payments</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/dashboard/deposit-withdraw" passHref>
                        <SidebarMenuButton
                          isActive={pathname === "/dashboard/deposit-withdraw"}
                        >
                          <DollarSign className="h-5 w-5 text-gray-500 dark:text-white" />
                          <span className="text-gray-500 dark:text-white">Deposit/Withdraw</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    {/*<SidebarMenuItem>*/}
                    {/*  <Link href="/dashboard/transactions" passHref>*/}
                    {/*    <SidebarMenuButton isActive={pathname === "/dashboard/transactions"}>*/}
                    {/*      <CreditCard className="h-5 w-5 text-gray-500 dark:text-white" />*/}
                    {/*      <span className="text-gray-500 dark:text-white">Transactions</span>*/}
                    {/*    </SidebarMenuButton>*/}
                    {/*  </Link>*/}
                    {/*</SidebarMenuItem>*/}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Groups Section */}
              <SidebarGroup>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-gray-500 dark:text-white">
                      <span>Groups</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <Link href="/dashboard/groups" passHref>
                            <SidebarMenuButton isActive={pathname === "/dashboard/groups"}>
                              <Users className="h-5 w-5 text-gray-500 dark:text-white" />
                              <span className="text-gray-500 dark:text-white">My Groups</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <Link href="/dashboard/groups/create" passHref>
                            <SidebarMenuButton
                              isActive={pathname === "/dashboard/groups/create"}
                            >
                              <Plus className="h-5 w-5 text-gray-500 dark:text-white" />
                              <span className="text-gray-500 dark:text-white">Create Group</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <Link href="/dashboard/groups/join" passHref>
                            <SidebarMenuButton isActive={pathname === "/dashboard/groups/join"}>
                              <LogIn className="h-5 w-5 text-gray-500 dark:text-white" />
                              <span className="text-gray-500 dark:text-white">Join Group</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <Link href="/dashboard/groups/saving-groups" passHref>
                            <SidebarMenuButton isActive={pathname === "/dashboard/groups/savings"}>
                              <LogIn className="h-5 w-5 text-gray-500 dark:text-white" />
                              <span className="text-gray-500 dark:text-white">Savings Groups</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard/settings" passHref>
                    <SidebarMenuButton isActive={pathname === "/dashboard/settings"}>
                      <Settings className="h-5 w-5 text-gray-500 dark:text-white" />
                      <span className="text-gray-500 dark:text-white">Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/dashboard/help" passHref>
                    <SidebarMenuButton isActive={pathname === "/dashboard/help"}>
                      <HelpCircle className="h-5 w-5 text-gray-500 dark:text-white" />
                      <span className="text-gray-500 dark:text-white">Help & Support</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>

              <div className="mt-4 px-2">
                <UserButton/>
              </div>
            </SidebarFooter>

            <SidebarRail />
          </Sidebar>
        )}

        <SidebarInset className="flex flex-col">
          {renderHeader()}

          <main className="flex-1 overflow-auto p-2 xs:p-3 sm:p-4 md:p-6">
            {loading ? (
              // Loading skeleton
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-7 sm:h-8 w-[200px] sm:w-[250px]" />
                  <Skeleton className="h-3 sm:h-4 w-[250px] sm:w-[350px]" />
                </div>
                <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  <Skeleton className="h-[150px] sm:h-[180px] rounded-lg sm:rounded-xl" />
                  <Skeleton className="h-[150px] sm:h-[180px] rounded-lg sm:rounded-xl" />
                  <Skeleton className="h-[150px] sm:h-[180px] rounded-lg sm:rounded-xl" />
                </div>
                <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                  <Skeleton className="h-[250px] sm:h-[300px] rounded-lg sm:rounded-xl" />
                  <Skeleton className="h-[250px] sm:h-[300px] rounded-lg sm:rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                {children}
              </>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
