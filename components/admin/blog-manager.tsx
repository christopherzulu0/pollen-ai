"use client"

import { useState, Suspense } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, Search, Filter, TrendingUp, Eye, MessageSquare, Share2, Calendar, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BlogEditorModal } from "./modals/blog-editor-modal"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  category: string
  author: string
  authorPosition?: string
  date: string
  status: "published" | "draft"
  views: number
  engagement?: number
  image?: string
  tags?: string[]
  slug?: string
  description?: string
}

interface ApiBlogPost {
  id: string
  title: string
  Description: string
  author: string
  author_Position: string
  category: string | null
  status: string | null
  Blog_image: string
  blog_tags: string[]
  read_time: string
  likes: number
  views: number
  engagement: number
  posted_at: string
  updated_at_Date: string
}

// Transform API response to BlogPost format
const transformBlogPost = (apiPost: ApiBlogPost): BlogPost => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    category: apiPost.category || "Uncategorized",
    author: apiPost.author,
    authorPosition: apiPost.author_Position,
    date: new Date(apiPost.posted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    status: (apiPost.status === "published" || apiPost.status === "draft" ? apiPost.status : "draft") as "published" | "draft",
    views: apiPost.views || 0,
    engagement: apiPost.engagement || 0,
    image: apiPost.Blog_image,
    tags: apiPost.blog_tags,
    description: apiPost.Description,
  }
}

// Fetch blog posts from API
const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog-posts')
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts')
  }
  const data: ApiBlogPost[] = await response.json()
  // Transform API data to BlogPost format
  return data.map(post => transformBlogPost(post))
}

// Delete blog post
const deleteBlogPost = async (id: string): Promise<void> => {
  const response = await fetch(`/api/blog-posts/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete blog post')
  }
}

// Skeleton Loader Component
function BlogManagerSkeleton() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <Skeleton className="h-8 sm:h-10 md:h-12 w-64 sm:w-80" />
                <Skeleton className="h-4 sm:h-5 w-48 sm:w-64 mt-2" />
              </div>
              <Skeleton className="h-10 w-32 sm:w-36" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-0">
                  <CardContent className="p-3 sm:p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 sm:h-8 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search and Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>

          {/* Table Skeleton */}
          <Card className="border-0 shadow-lg hidden lg:block">
            <CardContent className="p-0">
              <div className="space-y-3 p-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cards Skeleton */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border shadow-md">
                <CardContent className="p-3 sm:p-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogManagerContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<{ id?: string; title: string; category: string; author: string; authorPosition?: string; date: string; status: "published" | "draft"; views?: number; engagement?: number; image?: string; tags?: string[]; slug?: string; description?: string } | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [sortBy, setSortBy] = useState<"views" | "date" | "engagement">("views")

  const queryClient = useQueryClient()

  // Fetch blog posts using react-query
  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 30000, // 30 seconds
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
    },
  })

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || post.status === filterStatus
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    if (sortBy === "views") return b.views - a.views
    if (sortBy === "engagement") return (b.engagement || 0) - (a.engagement || 0)
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === "published").length,
    draft: posts.filter(p => p.status === "draft").length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const handleSave = (post: { id?: string; title: string; category: string; author: string; authorPosition?: string; date: string; status: "published" | "draft"; views?: number; engagement?: number; image?: string; tags?: string[]; slug?: string; description?: string }) => {
    // The modal handles the API call, we just need to refetch
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
    setShowModal(false)
    setEditingPost(null)
  }

  if (isLoading) {
    return <BlogManagerSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">Failed to load blog posts</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Header with Stats */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#003366] to-[#00CC66] bg-clip-text text-transparent">Blog Management</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Create, edit, and manage all blog posts</p>
              </div>
              <Button
                onClick={() => {
                  setEditingPost(null)
                  setShowModal(true)
                }}
                className="bg-gradient-to-r from-[#003366] to-[#00CC66] text-white hover:opacity-90 w-full sm:w-auto shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Posts</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-green-600 font-medium">Published</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1">{stats.published}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-yellow-600 font-medium">Drafts</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-900 mt-1">{stats.draft}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-purple-600 font-medium">Total Views</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900 mt-1">{stats.totalViews.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search, Filter, and Sort */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-sm sm:text-base"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 sm:px-4 py-2 border rounded-lg bg-white text-foreground text-sm sm:text-base w-full sm:w-auto flex-shrink-0"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            {/* <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 sm:px-4 py-2 border rounded-lg bg-white text-foreground text-sm sm:text-base w-full sm:w-auto flex-shrink-0"
            >
              <option value="views">Sort by Views</option>
              <option value="engagement">Sort by Engagement</option>
              <option value="date">Sort by Date</option>
            </select> */}
          </div>

          {/* Posts Table - Desktop View */}
          <Card className="border-0 shadow-lg hidden lg:block overflow-hidden">
            <CardContent className="p-0">
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No blog posts found</p>
                  <Button
                    onClick={() => {
                      setEditingPost(null)
                      setShowModal(true)
                    }}
                    className="mt-4 bg-gradient-to-r from-[#003366] to-[#00CC66] text-white hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Post
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gradient-to-r from-slate-50 to-slate-100">
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Title</th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Category</th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Author</th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Date</th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Status</th>
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Views</th>
                        {/* <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Engagement</th> */}
                        <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post, idx) => (
                      <tr key={post.id} className={`border-b hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm text-foreground font-medium max-w-xs truncate">{post.title}</td>
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">{post.category}</Badge>
                        </td>
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm text-muted-foreground">{post.author}</td>
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm text-muted-foreground">{post.date}</td>
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm">
                          <Badge variant={post.status === "published" ? "default" : "secondary"} className={`text-xs ${post.status === "published" ? "bg-green-100 text-green-800 border-0" : ""}`}>
                            {post.status}
                          </Badge>
                        </td>
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 xl:w-4 xl:h-4 text-muted-foreground" />
                            <span className="font-medium">{post.views.toLocaleString()}</span>
                          </div>
                        </td>
                        {/* <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 xl:w-4 xl:h-4 text-green-500" />
                            <span className="font-medium text-green-600">{post.engagement}%</span>
                          </div>
                        </td> */}
                        <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm flex gap-1 xl:gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingPost(post)
                              setShowModal(true)
                            }}
                            className="hover:bg-blue-100 hover:text-blue-700 h-7 w-7 xl:h-8 xl:w-8 p-0 flex-shrink-0"
                          >
                            <Edit className="w-3 h-3 xl:w-4 xl:h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(post.id)} 
                            disabled={deleteMutation.isPending}
                            className="hover:bg-red-100 hover:text-red-700 h-7 w-7 xl:h-8 xl:w-8 p-0 flex-shrink-0 disabled:opacity-50"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="w-3 h-3 xl:w-4 xl:h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 xl:w-4 xl:h-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Cards - Mobile/Tablet View */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {filteredPosts.length === 0 ? (
              <Card className="border shadow-md">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">No blog posts found</p>
                  <Button
                    onClick={() => {
                      setEditingPost(null)
                      setShowModal(true)
                    }}
                    className="bg-gradient-to-r from-[#003366] to-[#00CC66] text-white hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
              <Card key={post.id} className="border shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    {/* Header with Title and Actions */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground flex-1 min-w-0 break-words">{post.title}</h3>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingPost(post)
                            setShowModal(true)
                          }}
                          className="hover:bg-blue-100 hover:text-blue-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(post.id)} 
                          disabled={deleteMutation.isPending}
                          className="hover:bg-red-100 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0 disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Category and Status */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {post.category}
                      </Badge>
                      <Badge 
                        variant={post.status === "published" ? "default" : "secondary"} 
                        className={`text-xs ${post.status === "published" ? "bg-green-100 text-green-800 border-0" : ""}`}
                      >
                        {post.status}
                      </Badge>
                    </div>

                    {/* Author and Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span>By {post.author}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs sm:text-sm">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="font-medium">{post.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                        <span className="font-medium text-green-600">{post.engagement}% engagement</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          {showModal && (
            <BlogEditorModal
              post={editingPost}
              onClose={() => {
                setShowModal(false)
                setEditingPost(null)
              }}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function BlogManager() {
  return (
    <Suspense fallback={<BlogManagerSkeleton />}>
      <BlogManagerContent />
    </Suspense>
  )
}
