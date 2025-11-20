"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Calendar,
  User,
  Search,
  X,
  Clock,
  Bookmark,
  BookmarkCheck,
  Share2,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  SlidersHorizontal,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content?: string
  image: string
  date: string
  author: {
    name: string
    avatar: string
    role?: string
  }
  category: string
  tags: string[]
  readTime: number
  views?: number
  likes?: number
  isTrending?: boolean
  isFeatured?: boolean
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
  posted_at: string
  updated_at_Date: string
}

interface FeaturedAuthor {
  name: string
  position: string
  bio: string
  avatar: string
  tags: string[]
  articleCount: number
  totalLikes: number
  totalViews: number
}

interface BlogTopic {
  name: string
  articleCount: number
  type: 'category' | 'tag'
}

// Fetch blog posts from API
const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog-posts')
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts')
  }
  const data: ApiBlogPost[] = await response.json()
  
  console.log('Fetched blog posts from API:', data.length, 'posts')
  console.log('Posts with status:', data.map(p => ({ id: p.id, title: p.title, status: p.status })))
  
  // Transform API data to BlogPost format
  // Filter for published posts, or if no published posts exist, show all (for development)
  const publishedPosts = data.filter((post) => post.status === 'published')
  const postsToShow = publishedPosts.length > 0 ? publishedPosts : data
  
  console.log('Total posts from API:', data.length)
  console.log('Published posts:', publishedPosts.length)
  console.log('Posts to show:', postsToShow.length)
  
  return postsToShow.map((post, index) => {
      // Parse read time (e.g., "5 min" -> 5)
      const readTimeMatch = post.read_time.match(/(\d+)/)
      const readTime = readTimeMatch ? parseInt(readTimeMatch[1]) : 5
      
      // Create excerpt from description (first 200 characters)
      const excerpt = post.Description.length > 200 
        ? post.Description.substring(0, 200) + '...' 
        : post.Description
      
      return {
        id: post.id,
        title: post.title,
        excerpt: excerpt,
        content: post.Description,
        image: post.Blog_image || '/placeholder.svg?height=600&width=800',
        date: new Date(post.posted_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        author: {
          name: post.author,
          avatar: '/placeholder.svg?height=100&width=100',
          role: post.author_Position || undefined,
        },
        category: post.category || 'Uncategorized',
        tags: post.blog_tags || [],
        readTime: readTime,
        views: post.likes, // Using likes as views for now
        likes: post.likes,
        isTrending: post.likes > 50, // Consider trending if likes > 50
        isFeatured: index === 0, // First post is featured
      }
    })
}

// Skeleton Loader Component
function BlogSkeleton() {
  return (
    <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        
        {/* Trending Posts Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-none shadow-lg">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-none shadow-lg">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlogContent() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user, isLoaded: isUserLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState("all")
  const [readTimeFilter, setReadTimeFilter] = useState([0, 15])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [activeView, setActiveView] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [searchResults, setSearchResults] = useState<BlogPost[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [activeResultIndex, setActiveResultIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)
  const [sharePopoverOpen, setSharePopoverOpen] = useState<{ [key: string]: boolean }>({})

  // Fetch blog posts using react-query
  const { data: blogPosts = [], isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 60000, // 1 minute
  })

  // Fetch bookmarks for the current user
  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks')
      if (!response.ok) {
        if (response.status === 401) {
          return { bookmarkIds: [] }
        }
        throw new Error('Failed to fetch bookmarks')
      }
      return response.json()
    },
    enabled: !!user && isUserLoaded,
    staleTime: 30000,
  })

  // Fetch featured author
  const { data: featuredAuthor, isLoading: isLoadingAuthor } = useQuery<FeaturedAuthor>({
    queryKey: ['featuredAuthor'],
    queryFn: async () => {
      const response = await fetch('/api/featured-author')
      if (!response.ok) {
        throw new Error('Failed to fetch featured author')
      }
      return response.json()
    },
    staleTime: 300000, // 5 minutes
  })

  // Fetch blog topics
  const { data: topics = [], isLoading: isLoadingTopics } = useQuery<BlogTopic[]>({
    queryKey: ['blogTopics'],
    queryFn: async () => {
      const response = await fetch('/api/blog-topics')
      if (!response.ok) {
        throw new Error('Failed to fetch blog topics')
      }
      return response.json()
    },
    staleTime: 300000, // 5 minutes
  })

  const savedPosts = bookmarksData?.bookmarkIds || []
  
  // Debug logging
  useEffect(() => {
    console.log('BlogPosts state:', blogPosts.length, 'posts')
    console.log('Loading:', isLoading, 'Error:', error)
    if (blogPosts.length > 0) {
      console.log('First post:', blogPosts[0])
    }
  }, [blogPosts, isLoading, error])

  // Get unique categories and tags
  const categories = ["all", ...Array.from(new Set(blogPosts.map((post) => post.category)))]
  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)))

  // Featured post is the first one marked as featured
  const featuredPost = blogPosts.find((post) => post.isFeatured) || blogPosts[0]

  // Trending posts
  const trendingPosts = blogPosts.filter((post) => post.isTrending).slice(0, 3)

  // Initialize filtered posts with all posts
  useEffect(() => {
    if (blogPosts.length > 0) {
    setFilteredPosts(blogPosts)
    }
  }, [blogPosts])

  // Handle search and filtering
  const handleSearch = (scrollToResultsSection = false) => {
    setIsSearching(true)
    setShowSuggestions(false)

    setTimeout(() => {
      const filtered = blogPosts.filter((post) => {
        // Search term filter
        const matchesSearch =
          searchTerm === "" ||
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase())

        // Category filter
        const matchesCategory = categoryFilter === "all" || post.category === categoryFilter

        // Tags filter
        const matchesTags = tagFilters.length === 0 || tagFilters.some((tag) => post.tags.includes(tag))

        // Date filter
        const postDate = new Date(post.date)
        let matchesDate = true

        if (dateFilter === "last-month") {
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          matchesDate = postDate >= oneMonthAgo
        } else if (dateFilter === "last-3-months") {
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          matchesDate = postDate >= threeMonthsAgo
        } else if (dateFilter === "last-year") {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
          matchesDate = postDate >= oneYearAgo
        }

        // Read time filter
        const matchesReadTime = post.readTime >= readTimeFilter[0] && post.readTime <= readTimeFilter[1]

        // Tab filter
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "trending" && post.isTrending) ||
          (activeTab === "saved" && savedPosts.includes(post.id))

        return matchesSearch && matchesCategory && matchesTags && matchesDate && matchesReadTime && matchesTab
      })

      setFilteredPosts(filtered)
      setIsSearching(false)
      
      // Scroll to results if triggered from hero search
      if (scrollToResultsSection) {
        setTimeout(() => scrollToResults(), 100)
      }
    }, 500)
  }

  // Handle search suggestions and results
  useEffect(() => {
    // Only generate suggestions if we have blog posts loaded
    if (blogPosts.length === 0) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    if (searchTerm.length > 0) {
      // Generate search results - matching blog posts
      const matchingPosts = blogPosts.filter((post) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          post.author.name.toLowerCase().includes(searchLower) ||
          post.category.toLowerCase().includes(searchLower)
        )
      }).slice(0, 5) // Limit to 5 results

      setSearchResults(matchingPosts)
      setShowSearchResults(searchTerm.length > 0 && matchingPosts.length > 0)
      setActiveResultIndex(-1) // Reset active result index when results change

      // Generate suggestions based on post titles, tags, and categories
      if (searchTerm.length > 2) {
        const titleSuggestions = blogPosts
          .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((post) => post.title)
          .slice(0, 3)

        const tagSuggestions = Array.from(
          new Set(
            blogPosts.flatMap((post) => post.tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
          ),
        ).slice(0, 3)

        const categorySuggestions = Array.from(
          new Set(
            blogPosts
              .filter((post) => post.category.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((post) => post.category),
          ),
        ).slice(0, 2)

        const authorSuggestions = Array.from(
          new Set(
            blogPosts
              .filter((post) => post.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((post) => `Author: ${post.author.name}`),
          ),
        ).slice(0, 2)

        const allSuggestions = [
          ...titleSuggestions,
          ...tagSuggestions,
          ...categorySuggestions,
          ...authorSuggestions,
        ].slice(0, 5)

        setSearchSuggestions(allSuggestions)
        setShowSuggestions(allSuggestions.length > 0 && matchingPosts.length === 0)
        setActiveSuggestionIndex(-1)
      } else {
        setSearchSuggestions([])
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
      }
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
      setSearchResults([])
      setShowSearchResults(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]) // Only depend on searchTerm to avoid infinite loops

  // Handle tag selection
  const toggleTagFilter = (tag: string) => {
    setTagFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Mutation for bookmark
  const bookmarkMutation = useMutation({
    mutationFn: async ({ postId, isBookmarking }: { postId: string; isBookmarking: boolean }) => {
      const method = isBookmarking ? 'POST' : 'DELETE'
      const response = await fetch(`/api/blog-posts/${postId}/bookmark`, {
        method,
      })
      if (!response.ok) {
        throw new Error(`Failed to ${isBookmarking ? 'bookmark' : 'unbookmark'} post`)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
    onError: (error) => {
      toast({
        title: "Failed to update bookmark",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  // Handle save/bookmark post
  const toggleSavePost = (postId: string) => {
    if (!user || !isUserLoaded) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark posts.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const isBookmarking = !savedPosts.includes(postId)
    bookmarkMutation.mutate({ postId, isBookmarking })

    toast({
      title: isBookmarking ? "Post saved to bookmarks" : "Post removed from bookmarks",
      description: isBookmarking
        ? "You can find it in your saved posts."
        : "You can always save it again later.",
      duration: 3000,
    })
  }

  // Check if native share is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'share' in navigator) {
      setSupportsNativeShare(true)
    }
  }, [])

  // Handle share post
  const handleSharePost = async (post: BlogPost, platform?: string) => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.id}` : ''
    const shareTitle = post.title
    const shareText = post.excerpt || post.title

    // Update engagement when user shares
    try {
      await fetch(`/api/blog-posts/${post.id}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'share' }),
      })
    } catch (error) {
      console.error('Error updating engagement:', error)
    }

    // If no platform specified and native share is available, use it
    if (!platform && supportsNativeShare) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
    toast({
          title: "Shared successfully!",
          description: "The article has been shared.",
          duration: 3000,
        })
        setSharePopoverOpen(prev => ({ ...prev, [post.id]: false }))
        return
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
          toast({
            title: "Share failed",
            description: "Could not share the article. Please try again.",
            variant: "destructive",
      duration: 3000,
    })
        }
        setSharePopoverOpen(prev => ({ ...prev, [post.id]: false }))
        return
      }
    }

    // Handle specific platform or copy link
    try {
      if (platform === "Copy Link" || (!platform && !supportsNativeShare)) {
        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl)
          toast({
            title: "Link copied!",
            description: "The article link has been copied to your clipboard.",
            duration: 3000,
          })
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea")
          textArea.value = shareUrl
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          try {
            document.execCommand('copy')
            toast({
              title: "Link copied!",
              description: "The article link has been copied to your clipboard.",
              duration: 3000,
            })
          } catch (err) {
            toast({
              title: "Failed to copy link",
              description: "Please copy the link manually.",
              variant: "destructive",
              duration: 3000,
            })
          }
          document.body.removeChild(textArea)
        }
        setSharePopoverOpen(prev => ({ ...prev, [post.id]: false }))
      } else if (platform) {
        // Platform-specific share URLs
        let shareWindowUrl = ''
        const windowWidth = 600
        const windowHeight = 400
        const left = (window.innerWidth - windowWidth) / 2
        const top = (window.innerHeight - windowHeight) / 2

        switch (platform) {
          case "Facebook":
            shareWindowUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
            break
          case "Twitter":
            shareWindowUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
            break
          case "LinkedIn":
            shareWindowUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
            break
          default:
            toast({
              title: "Share option not available",
              description: "This share option is not supported.",
              variant: "destructive",
              duration: 3000,
            })
            setSharePopoverOpen(prev => ({ ...prev, [post.id]: false }))
            return
        }

        if (shareWindowUrl) {
          window.open(
            shareWindowUrl,
            'share-dialog',
            `width=${windowWidth},height=${windowHeight},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1`
          )
          toast({
            title: `Opening ${platform}...`,
            description: "Complete the share in the popup window.",
            duration: 2000,
          })
          setSharePopoverOpen(prev => ({ ...prev, [post.id]: false }))
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast({
        title: "Share failed",
        description: "An error occurred while sharing. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
      setSharePopoverOpen(prev => ({ ...prev, [post.id]: false }))
    }
  }

  // Handle load more posts
  const loadMorePosts = () => {
    setVisiblePosts((prev) => Math.min(prev + 6, filteredPosts.length))
  }

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Debounced search effect - auto-search as user types
  useEffect(() => {
    if (blogPosts.length === 0) return

    const timeoutId = setTimeout(() => {
      handleSearch(false) // Don't scroll on auto-search
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]) // Only depend on searchTerm to avoid infinite loops

  // Apply filters when they change
  useEffect(() => {
    handleSearch()
  }, [categoryFilter, tagFilters, dateFilter, readTimeFilter, activeTab])

  // Reset visible posts count when filtered posts change
  useEffect(() => {
    setVisiblePosts(6)
  }, [filteredPosts])

  // Scroll to results when search is triggered from hero
  const scrollToResults = () => {
    const resultsSection = document.getElementById('blog-content-section')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#003366] to-[#002244] text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white bg-grid-8 opacity-10"></div>
          <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[140%] bg-[#00CC66]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[140%] bg-[#00CC66]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <Badge className="mb-4 bg-[#00CC66] hover:bg-[#00BB55] text-white px-3 py-1 text-sm">
                Pollen AI Blog
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-tight">
                Insights for a <span className="text-[#00CC66]">Financially Inclusive</span> Future
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl">
                Explore the latest trends, insights, and stories about financial inclusion, technology, and sustainable
                development from our experts.
              </p>

              <div className="relative max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSearch(true)
                  }}
                  className="relative"
                >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search articles, topics, or authors..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setActiveSuggestionIndex(-1)
                      setActiveResultIndex(-1)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        if (activeResultIndex >= 0 && searchResults[activeResultIndex]) {
                          // Navigate to active result
                          window.location.href = `/blog/${searchResults[activeResultIndex].id}`
                        } else if (activeSuggestionIndex >= 0 && searchSuggestions[activeSuggestionIndex]) {
                          // Select active suggestion
                          const suggestion = searchSuggestions[activeSuggestionIndex]
                          if (suggestion.startsWith("Author: ")) {
                            setSearchTerm(suggestion.replace("Author: ", ""))
                          } else {
                            setSearchTerm(suggestion)
                          }
                          setShowSuggestions(false)
                          setShowSearchResults(false)
                          setActiveSuggestionIndex(-1)
                          setTimeout(() => handleSearch(true), 100)
                        } else {
                          // Perform search with current term
                          handleSearch(true)
                        }
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault()
                        if (showSearchResults && searchResults.length > 0) {
                          setActiveResultIndex((prev) => 
                            prev < searchResults.length - 1 ? prev + 1 : prev
                          )
                          setActiveSuggestionIndex(-1)
                        } else if (showSuggestions && searchSuggestions.length > 0) {
                          setActiveSuggestionIndex((prev) => 
                            prev < searchSuggestions.length - 1 ? prev + 1 : prev
                          )
                        }
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault()
                        if (activeResultIndex > 0) {
                          setActiveResultIndex((prev) => prev - 1)
                        } else if (activeResultIndex === 0) {
                          setActiveResultIndex(-1)
                        } else if (showSuggestions && searchSuggestions.length > 0) {
                          setActiveSuggestionIndex((prev) => 
                            prev > 0 ? prev - 1 : -1
                          )
                        }
                      } else if (e.key === "Escape") {
                        e.preventDefault()
                        setShowSuggestions(false)
                        setShowSearchResults(false)
                        setActiveSuggestionIndex(-1)
                        setActiveResultIndex(-1)
                        searchInputRef.current?.blur()
                      }
                    }}
                    onFocus={() => {
                      if (searchTerm.length > 0 && searchResults.length > 0) {
                        setShowSearchResults(true)
                      }
                      if (searchTerm.length > 2 && searchSuggestions.length > 0 && searchResults.length === 0) {
                        setShowSuggestions(true)
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestions(false)
                        setShowSearchResults(false)
                      }, 200)
                    }}
                    className="pl-10 pr-20 py-6 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus:border-[#00CC66] rounded-full focus:ring-2 focus:ring-[#00CC66]/50"
                  />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchTerm && (
                    <button
                          type="button"
                          className="text-white/50 hover:text-white transition-colors p-1"
                          onClick={(e) => {
                            e.preventDefault()
                            setSearchTerm("")
                            setShowSuggestions(false)
                            setShowSearchResults(false)
                            setActiveSuggestionIndex(-1)
                            setActiveResultIndex(-1)
                            handleSearch()
                      }}
                    >
                          <X className="h-4 w-4" />
                    </button>
                  )}
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="bg-[#00CC66] hover:bg-[#00BB55] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors"
                        aria-label="Search"
                      >
                        {isSearching ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                </div>
                  </div>
                </form>

                {/* Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Search Results
                      </div>
                      {searchResults.map((post, index) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.id}`}
                          className={`block px-3 py-3 rounded-lg transition-colors ${
                            index === activeResultIndex
                              ? "bg-[#00CC66]/10 dark:bg-[#00CC66]/20"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onMouseEnter={() => setActiveResultIndex(index)}
                          onClick={() => {
                            setShowSearchResults(false)
                            setShowSuggestions(false)
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-semibold mb-1 line-clamp-1 ${
                                index === activeResultIndex
                                  ? "text-[#00CC66] dark:text-[#00CC66]"
                                  : "text-gray-900 dark:text-white"
                              }`}>
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                <span>{post.category}</span>
                                <span>•</span>
                                <span>{post.readTime} min read</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleSearch(true)
                            setShowSearchResults(false)
                          }}
                          className="w-full text-sm text-[#00CC66] hover:text-[#00BB55] font-medium text-center"
                        >
                          View all results →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search suggestions - only show if no results */}
                {showSuggestions && searchSuggestions.length > 0 && !showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <ul className="py-2 max-h-64 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={`px-4 py-2 cursor-pointer transition-colors ${
                            index === activeSuggestionIndex
                              ? "bg-[#00CC66]/10 dark:bg-[#00CC66]/20"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => {
                            if (suggestion.startsWith("Author: ")) {
                              setSearchTerm(suggestion.replace("Author: ", ""))
                            } else {
                              setSearchTerm(suggestion)
                            }
                            setShowSuggestions(false)
                            setActiveSuggestionIndex(-1)
                            setTimeout(() => handleSearch(true), 100)
                          }}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className={`${
                              index === activeSuggestionIndex
                                ? "text-[#00CC66] dark:text-[#00CC66] font-medium"
                                : "text-gray-800 dark:text-gray-200"
                            }`}>
                              {suggestion}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-white/70">Popular:</span>
                {["AI", "Financial Inclusion", "Climate Finance", "Blockchain"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(tag)
                      handleSearch(true)
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {featuredPost && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative h-[400px] w-full perspective-1000">
                <div className="absolute top-0 left-0 w-full h-full rotate-y-[8deg] shadow-2xl rounded-xl overflow-hidden transform-gpu preserve-3d">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt="Featured blog post"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <Badge className="mb-2 bg-[#00CC66]">Featured</Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{featuredPost.title}</h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{featuredPost.date}</span>
                      <User className="h-4 w-4 mr-1" />
                      <span>{featuredPost.author.name}</span>
                    </div>
                  </div>
                </div>

                  {blogPosts[2] && (
                <div className="absolute top-10 -right-10 w-[60%] h-[60%] rotate-y-[-8deg] shadow-xl rounded-xl overflow-hidden transform-gpu preserve-3d">
                  <Image src={blogPosts[2].image || "/placeholder.svg"} alt="Blog post" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-sm font-bold text-white">{blogPosts[2].title}</h3>
                  </div>
                </div>
                  )}
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section id="blog-content-section" className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          {isLoading ? (
            <BlogSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <Card className="border-destructive max-w-md mx-auto">
                <CardContent className="p-6">
                  <p className="text-destructive mb-4">Failed to load blog posts</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <Search className="h-12 w-12 mx-auto text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#003366] dark:text-white mb-2">No articles found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                No published blog posts available yet.
              </p>
            </div>
          ) : (
            <>
          {/* Controls and Filters */}
          <div className="mb-8 flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-[#003366] dark:text-white">Blog Posts</h2>
                <Badge className="bg-[#00CC66]">{filteredPosts.length}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="dark-mode" className="text-sm text-gray-600 dark:text-gray-300">
                    Dark Mode
                  </Label>
                  <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>

                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={cn(
                      "px-3 py-2 text-sm",
                      activeView === "grid"
                        ? "bg-[#003366] text-white"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300",
                    )}
                    onClick={() => setActiveView("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={cn(
                      "px-3 py-2 text-sm",
                      activeView === "list"
                        ? "bg-[#003366] text-white"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300",
                    )}
                    onClick={() => setActiveView("list")}
                  >
                    List
                  </button>
                </div>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {(categoryFilter !== "all" ||
                    tagFilters.length > 0 ||
                    dateFilter !== "all" ||
                    readTimeFilter[0] !== 0 ||
                    readTimeFilter[1] !== 15) && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-[#00CC66] text-white">
                      {(categoryFilter !== "all" ? 1 : 0) +
                        (tagFilters.length > 0 ? 1 : 0) +
                        (dateFilter !== "all" ? 1 : 0) +
                        (readTimeFilter[0] !== 0 || readTimeFilter[1] !== 15 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-md mx-auto md:mx-0 grid grid-cols-3 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white text-gray-700 dark:text-gray-300">
                  All Posts
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-[#003366] data-[state=active]:text-white text-gray-700 dark:text-gray-300"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger value="saved" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white text-gray-700 dark:text-gray-300">
                  Saved ({savedPosts.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</h3>
                      <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                          <SelectValue placeholder="Select category" className="text-gray-900 dark:text-gray-100" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">
                              {category === "all" ? "All Categories" : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</h3>
                      <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 scrollbar-hide">
                        {allTags.map((tag) => (
                          <div key={tag} className="flex items-center">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={tagFilters.includes(tag)}
                              onCheckedChange={() => toggleTagFilter(tag)}
                              className="mr-2 border-gray-300 dark:border-gray-600"
                            />
                            <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer text-gray-900 dark:text-gray-100">
                              {tag}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</h3>
                      <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                          <SelectValue placeholder="Select date range" className="text-gray-900 dark:text-gray-100" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <SelectItem value="all" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">All Time</SelectItem>
                          <SelectItem value="last-month" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Last Month</SelectItem>
                          <SelectItem value="last-3-months" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Last 3 Months</SelectItem>
                          <SelectItem value="last-year" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Read Time Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Read Time</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {readTimeFilter[0]}-{readTimeFilter[1]} min
                        </span>
                      </div>
                      <Slider
                        value={readTimeFilter}
                        min={0}
                        max={15}
                        step={1}
                        onValueChange={setReadTimeFilter}
                        className="my-4"
                      />
                    </div>

                    {/* Filter Actions */}
                    <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setCategoryFilter("all")
                          setTagFilters([])
                          setDateFilter("all")
                          setReadTimeFilter([0, 15])
                        }}
                      >
                        Reset Filters
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#003366] hover:bg-[#002244] text-white" 
                        onClick={() => handleSearch(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trending Posts Section */}
          {activeTab === "all" && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-5 w-5 text-[#00CC66] mr-2" />
                <h3 className="text-xl font-bold text-[#003366] dark:text-white">Trending Now</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                      <div className="relative h-48">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-[#00CC66] hover:bg-[#00BB55]">Trending</Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                                  onClick={() => toggleSavePost(post.id)}
                                >
                                  {savedPosts.includes(post.id) ? (
                                    <BookmarkCheck className="h-4 w-4" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {savedPosts.includes(post.id) ? "Saved" : "Save for later"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Popover open={sharePopoverOpen[post.id]} onOpenChange={(open) => setSharePopoverOpen(prev => ({ ...prev, [post.id]: open }))}>
                            <PopoverTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <div className="space-y-1">
                                {supportsNativeShare && (
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSharePost(post)}
                                  >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share via...
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleSharePost(post, "Facebook")}
                                >
                                  <Facebook className="h-4 w-4 mr-2" />
                                  Facebook
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleSharePost(post, "Twitter")}
                                >
                                  <Twitter className="h-4 w-4 mr-2" />
                                  Twitter
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleSharePost(post, "LinkedIn")}
                                >
                                  <Linkedin className="h-4 w-4 mr-2" />
                                  LinkedIn
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleSharePost(post, "Copy Link")}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Badge
                            variant="outline"
                            className="mr-2 bg-[#003366]/10 text-[#003366] dark:bg-[#003366]/20 dark:text-[#00CC66] border-[#003366]/20"
                          >
                            {post.category}
                          </Badge>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-3 hover:text-[#00CC66] dark:hover:text-[#00CC66] transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                              <Image
                                src={post.author.avatar || "/placeholder.svg"}
                                alt={post.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {post.author.name}
                              </span>
                              {post.author.role && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.role}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readTime} min</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0">
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-[#00CC66] hover:text-[#00BB55] font-medium flex items-center"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Main Blog Posts */}
          {isSearching ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00CC66]"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="mb-4">
                {activeTab === "saved" ? (
                  <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
                ) : (
                <Search className="h-12 w-12 mx-auto text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-[#003366] dark:text-white mb-2">
                {activeTab === "saved" 
                  ? !user || !isUserLoaded
                    ? "Sign in to view saved posts"
                    : "No saved articles yet"
                  : "No articles found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {activeTab === "saved"
                  ? !user || !isUserLoaded
                    ? "Please sign in to bookmark and save articles for later."
                    : "Start bookmarking articles you want to read later by clicking the bookmark icon on any post."
                  : "We couldn't find any articles matching your search criteria."}
              </p>
              {activeTab === "saved" && (!user || !isUserLoaded) ? (
                <Button
                  className="bg-[#003366] hover:bg-[#002244]"
                  onClick={() => window.location.href = '/sign-in'}
                >
                  Sign In
                </Button>
              ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setTagFilters([])
                  setDateFilter("all")
                  setReadTimeFilter([0, 15])
                    setActiveTab("all")
                  setFilteredPosts(blogPosts)
                }}
              >
                  {activeTab === "saved" ? "Browse All Posts" : "Clear Filters"}
              </Button>
              )}
            </div>
          ) : (
            <>
              {activeView === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                        <div className="relative h-48">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {post.isTrending && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-[#00CC66] hover:bg-[#00BB55]">Trending</Badge>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                                    onClick={() => toggleSavePost(post.id)}
                                  >
                                    {savedPosts.includes(post.id) ? (
                                      <BookmarkCheck className="h-4 w-4" />
                                    ) : (
                                      <Bookmark className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {savedPosts.includes(post.id) ? "Saved" : "Save for later"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <Popover open={sharePopoverOpen[post.id]} onOpenChange={(open) => setSharePopoverOpen(prev => ({ ...prev, [post.id]: open }))}>
                              <PopoverTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <div className="space-y-1">
                                  {supportsNativeShare && (
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      onClick={() => handleSharePost(post)}
                                    >
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Share via...
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSharePost(post, "Facebook")}
                                  >
                                    <Facebook className="h-4 w-4 mr-2" />
                                    Facebook
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSharePost(post, "Twitter")}
                                  >
                                    <Twitter className="h-4 w-4 mr-2" />
                                    Twitter
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSharePost(post, "LinkedIn")}
                                  >
                                    <Linkedin className="h-4 w-4 mr-2" />
                                    LinkedIn
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSharePost(post, "Copy Link")}
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Link
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <Badge
                              variant="outline"
                              className="mr-2 bg-[#003366]/10 text-[#003366] dark:bg-[#003366]/20 dark:text-[#00CC66] border-[#003366]/20"
                            >
                              {post.category}
                            </Badge>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                          <Link href={`/blog/${post.id}`}>
                            <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-3 hover:text-[#00CC66] dark:hover:text-[#00CC66] transition-colors">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                                <Image
                                  src={post.author.avatar || "/placeholder.svg"}
                                  alt={post.author.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {post.author.name}
                                </span>
                                {post.author.role && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.role}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-0">
                          <Link
                            href={`/blog/${post.id}`}
                            className="text-[#00CC66] hover:text-[#00BB55] font-medium flex items-center"
                          >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 mb-12">
                  {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="relative h-48 md:h-full">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            {post.isTrending && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-[#00CC66] hover:bg-[#00BB55]">Trending</Badge>
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-2 p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className="mr-2 bg-[#003366]/10 text-[#003366] dark:bg-[#003366]/20 dark:text-[#00CC66] border-[#003366]/20"
                                >
                                  {post.category}
                                </Badge>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{post.date}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => toggleSavePost(post.id)}
                                      >
                                        {savedPosts.includes(post.id) ? (
                                          <BookmarkCheck className="h-4 w-4 text-[#00CC66]" />
                                        ) : (
                                          <Bookmark className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {savedPosts.includes(post.id) ? "Saved" : "Save for later"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <Popover open={sharePopoverOpen[post.id]} onOpenChange={(open) => setSharePopoverOpen(prev => ({ ...prev, [post.id]: open }))}>
                                  <PopoverTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                      className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-56 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <div className="space-y-1">
                                      {supportsNativeShare && (
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                          onClick={() => handleSharePost(post)}
                                        >
                                          <Share2 className="h-4 w-4 mr-2" />
                                          Share via...
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSharePost(post, "Facebook")}
                                      >
                                        <Facebook className="h-4 w-4 mr-2" />
                                        Facebook
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSharePost(post, "Twitter")}
                                      >
                                        <Twitter className="h-4 w-4 mr-2" />
                                        Twitter
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSharePost(post, "LinkedIn")}
                                      >
                                        <Linkedin className="h-4 w-4 mr-2" />
                                        LinkedIn
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSharePost(post, "Copy Link")}
                                      >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Link
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <Link href={`/blog/${post.id}`}>
                              <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-3 hover:text-[#00CC66] dark:hover:text-[#00CC66] transition-colors">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 cursor-pointer"
                                  onClick={() => {
                                    if (!tagFilters.includes(tag)) {
                                      toggleTagFilter(tag)
                                      handleSearch()
                                    }
                                  }}
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                                  <Image
                                    src={post.author.avatar || "/placeholder.svg"}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {post.author.name}
                                  </span>
                                  {post.author.role && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.role}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{post.readTime} min read</span>
                                </div>
                                <Link
                                  href={`/blog/${post.id}`}
                                  className="text-[#00CC66] hover:text-[#00BB55] font-medium flex items-center"
                                >
                                  Read More
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {visiblePosts < filteredPosts.length && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white dark:border-[#00CC66] dark:text-[#00CC66] dark:hover:bg-[#00CC66] dark:hover:text-white"
                    onClick={loadMorePosts}
                  >
                    Load More Articles
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Featured Author Section */}
          {isLoadingAuthor ? (
            <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <Skeleton className="w-32 h-32 mx-auto md:mx-0 rounded-full" />
                </div>
                <div className="md:col-span-2 text-center md:text-left space-y-4">
                  <Skeleton className="h-6 w-32 mx-auto md:mx-0" />
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                  <Skeleton className="h-10 w-40 mx-auto md:mx-0" />
                </div>
              </div>
            </div>
          ) : featuredAuthor ? (
          <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <div className="relative w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-[#00CC66]">
                  <Image
                      src={featuredAuthor.avatar || "/placeholder.svg?height=200&width=200"}
                      alt={featuredAuthor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-2 text-center md:text-left">
                <Badge className="mb-2 bg-[#00CC66]">Featured Author</Badge>
                  <h3 className="text-2xl font-bold text-[#003366] dark:text-white mb-2">{featuredAuthor.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {featuredAuthor.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {featuredAuthor.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700">
                        {tag}
                  </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{featuredAuthor.articleCount} Articles</span>
                    <span>•</span>
                    <span>{featuredAuthor.totalViews} Views</span>
                    <span>•</span>
                    <span>{featuredAuthor.totalLikes} Likes</span>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white dark:border-[#00CC66] dark:text-[#00CC66] dark:hover:bg-[#00CC66] dark:hover:text-white"
                      onClick={() => {
                        setSearchTerm(featuredAuthor.name)
                        handleSearch(true)
                      }}
                  >
                    View All Articles
                  </Button>
                </div>
              </div>
            </div>
          </div>
          ) : null}

      {/* Blog Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Page</span>
              <Input 
                className="w-16 h-8 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600" 
                defaultValue="1" 
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">of 10</span>
            </div>
          </div>
        </div>
      </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#003366] to-[#002244] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-[#00CC66] hover:bg-[#00BB55] px-3 py-1">Stay Updated</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-white/80 mb-8 md:text-lg">
                Get the latest insights, news, and stories about financial inclusion and technology delivered directly
                to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Your email address"
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00CC66]"
                />
                <Button className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Subscribe</Button>
              </div>
              <p className="text-white/60 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CC66] mr-2"></div>
                  <span className="text-sm">Weekly Updates</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CC66] mr-2"></div>
                  <span className="text-sm">Exclusive Content</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CC66] mr-2"></div>
                  <span className="text-sm">No Spam</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Topics Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003366] dark:text-white mb-4">
              Explore Related Topics
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dive deeper into the subjects that matter most to you with our curated topic collections.
            </p>
          </div>

          {isLoadingTopics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : topics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <motion.div
                  key={`${topic.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/blog/topic/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center h-full flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#00CC66]/20">
                      <h3 className="text-lg font-semibold text-[#003366] dark:text-white mb-2">{topic.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {topic.articleCount} {topic.articleCount === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No topics available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#003366] to-[#002244] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-[#00CC66] hover:bg-[#00BB55] px-3 py-1">Stay Updated</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-white/80 mb-8 md:text-lg">
                Get the latest insights, news, and stories about financial inclusion and technology delivered directly
                to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Your email address"
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00CC66]"
                />
                <Button className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Subscribe</Button>
            </div>
              <p className="text-white/60 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CC66] mr-2"></div>
                  <span className="text-sm">Weekly Updates</span>
            </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CC66] mr-2"></div>
                  <span className="text-sm">Exclusive Content</span>
          </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CC66] mr-2"></div>
                  <span className="text-sm">No Spam</span>
        </div>
      </div>
            </motion.div>
          </div>
        </div>
      </section>

    
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col min-h-screen">
          {/* Hero Section - Always visible */}
          <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#003366] to-[#002244] text-white overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <Badge className="mb-4 bg-[#00CC66] hover:bg-[#00BB55] text-white px-3 py-1 text-sm">
                    Pollen AI Blog
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-tight">
                    Insights for a <span className="text-[#00CC66]">Financially Inclusive</span> Future
                  </h1>
                  <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl">
                    Explore the latest trends, insights, and stories about financial inclusion, technology, and sustainable
                    development from our experts.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Blog Content Section Skeleton */}
          <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
            <div className="container px-4 md:px-6 mx-auto">
              <BlogSkeleton />
            </div>
          </section>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  )
}

