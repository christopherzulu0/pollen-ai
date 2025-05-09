"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { LogIn, Plus, ChevronRight, FileText, Clock } from "lucide-react"
import { useEffect } from "react"

// Define Group type
interface Group {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  contributionAmount: number;
  memberships?: { id: string }[];
}

export default function GroupsPage() {
  const { toast } = useToast()

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Savings Groups</h1>
          <p className="text-muted-foreground">Manage your cooperative savings groups</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/groups/join" passHref>
            <Button>
              <LogIn className="mr-2 h-4 w-4" />
              Join Group
            </Button>
          </Link>
          <Link href="/dashboard/groups/create" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          {isLoadingGroups ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px] rounded-xl" />
              ))}
            </div>
          ) : groupsError ? (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-10 w-10 text-red-500/50" />
                  <p className="mt-2 text-red-500">Error loading groups</p>
                  <Button variant="outline" className="mt-4" onClick={() => refetchGroups()}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : groups.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <Card key={group.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="h-3 bg-gradient-to-r from-teal-400 to-emerald-600"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{group.name}</CardTitle>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                        {group.status}
                      </Badge>
                    </div>
                    <CardDescription>Created on {new Date(group.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Members</span>
                        <span className="font-medium">{group.memberships?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Deposits</span>
                        <span className="font-medium">ZMW {group.contributionAmount || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next Meeting</span>
                        <span className="font-medium">Upcoming</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full justify-between">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-40 items-center justify-center p-6">
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No groups found</p>
                  <Link href="/dashboard/groups/create" passHref>
                    <Button variant="outline" className="mt-4">
                      Create a Group
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardContent className="flex h-40 items-center justify-center p-6">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No pending groups</p>
                <Link href="/dashboard/groups/join" passHref>
                  <Button variant="outline" className="mt-4">
                    Join a Group
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="archived" className="mt-6">
          <Card>
            <CardContent className="flex h-40 items-center justify-center p-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No archived groups</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}