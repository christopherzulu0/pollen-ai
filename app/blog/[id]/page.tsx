"use client"

import type React from "react"

import { useState, useEffect, Suspense, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Bookmark,
  BookmarkCheck,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ThumbsUp,
  MessageSquare,
  Tag,
  ArrowRight,
  Loader2,
  Smile,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Share2,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: {
    name: string
    avatar: string
    role?: string
    bio?: string
  }
  category: string
  tags: string[]
  readTime: number
  views?: number
  likes?: number
  engagement?: number
  comments?: number
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
  views: number
  engagement: number
  posted_at: string
  updated_at_Date: string
  blog_comments?: ApiBlogComment[]
}

interface ApiBlogComment {
  id: string
  comment: string
  comment_by: string
  comment_at: string
  comment_likes: number
  blog_post_id: string
  parent_id?: string | null
  audio_url?: string | null
  replies?: ApiBlogComment[]
}

interface BlogComment {
  id: string
  author: {
    name: string
    avatar: string
    isAuthor?: boolean
  }
  date: string
  content: string
  likes: number
  audioUrl?: string | null
  replies: Array<BlogComment>
}

// Fetch single blog post from API
const fetchBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await fetch(`/api/blog-posts?id=${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch blog post')
  }
  const data: ApiBlogPost = await response.json()
  
  // Parse read time (e.g., "5 min" -> 5)
  const readTimeMatch = data.read_time.match(/(\d+)/)
  const readTime = readTimeMatch ? parseInt(readTimeMatch[1]) : 5
  
  // Create excerpt from description (first 200 characters)
  const excerpt = data.Description.length > 200 
    ? data.Description.substring(0, 200) + '...' 
    : data.Description
  
  // Format content as HTML (convert line breaks to paragraphs)
  const content = data.Description.split('\n\n').map(para => {
    if (para.trim()) {
      return `<p>${para.trim().replace(/\n/g, '<br>')}</p>`
    }
    return ''
  }).join('')
  
  return {
    id: data.id,
    title: data.title,
    excerpt: excerpt,
    content: content || `<p>${data.Description}</p>`,
    image: data.Blog_image || '/placeholder.svg?height=600&width=800',
    date: new Date(data.posted_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    author: {
      name: data.author,
      avatar: '/placeholder.svg?height=100&width=100',
      role: data.author_Position || undefined,
      bio: `Author and expert in ${data.category || 'general topics'}`,
    },
    category: data.category || 'Uncategorized',
    tags: data.blog_tags || [],
    readTime: readTime,
    views: data.views || 0,
    likes: data.likes || 0,
    engagement: data.engagement || 0,
    comments: data.blog_comments?.length || 0,
    isTrending: data.likes > 50,
    isFeatured: false,
  }
}

// Transform API comment to UI format
const transformComment = (apiComment: ApiBlogComment, postAuthor?: string): BlogComment => {
  return {
    id: apiComment.id,
    author: {
      name: apiComment.comment_by,
      avatar: '/placeholder.svg?height=50&width=50',
      isAuthor: apiComment.comment_by === postAuthor,
    },
    date: new Date(apiComment.comment_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    content: apiComment.comment,
    likes: apiComment.comment_likes,
    audioUrl: apiComment.audio_url || null,
    replies: apiComment.replies?.map(reply => transformComment(reply, postAuthor)) || [],
  }
}

// Fetch comments for a blog post
const fetchComments = async (postId: string, postAuthor?: string): Promise<BlogComment[]> => {
  const response = await fetch(`/api/blog-posts/${postId}/comments`)
  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }
  const data: ApiBlogComment[] = await response.json()
  
  return data.map((comment) => transformComment(comment, postAuthor))
}

// Fetch all blog posts for related posts
const fetchAllBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog-posts')
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts')
  }
  const data: ApiBlogPost[] = await response.json()
  
  // Filter published posts only
  const publishedPosts = data.filter((post) => post.status === 'published')
  
  return publishedPosts.map((post) => {
    const readTimeMatch = post.read_time.match(/(\d+)/)
    const readTime = readTimeMatch ? parseInt(readTimeMatch[1]) : 5
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
      views: post.likes,
      likes: post.likes,
      comments: post.blog_comments?.length || 0,
      isTrending: post.likes > 50,
      isFeatured: false,
    }
  })
}

// Skeleton Loader Component
function BlogPostSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative pt-16 pb-24 bg-gradient-to-br from-[#003366] to-[#002244] text-white overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-32 mb-6 bg-white/20" />
            <Skeleton className="h-6 w-24 mb-4 bg-white/20" />
            <Skeleton className="h-12 w-full mb-6 bg-white/20" />
            <div className="flex flex-wrap gap-4 mb-8">
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-4 bg-white/20" />
              <div>
                <Skeleton className="h-4 w-32 mb-2 bg-white/20" />
                <Skeleton className="h-3 w-24 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Skeleton */}
      <div className="relative -mt-16 mb-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-[300px] md:h-[400px] lg:h-[500px] rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <section className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Emoji picker component
const commonEmojis = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
  '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
  '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',
  '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
  '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
  '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤞',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
]

function EmojiPicker({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm z-10"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(!isOpen)
          }}
          title="Add emoji"
        >
          <Smile className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end" side="top">
        <div className="grid grid-cols-10 gap-1 max-h-60 overflow-y-auto">
          {commonEmojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
              onClick={() => {
                onEmojiSelect(emoji)
                setIsOpen(false)
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Voice Recorder Component
function VoiceRecorder({ onRecordingComplete, onCancel }: { onRecordingComplete: (audioUrl: string) => void; onCancel: () => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { startUpload, isUploading: isUploadThingUploading } = useUploadThing("voiceCommentUploader")

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      chunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please ensure you have granted microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleUpload = async () => {
    if (!audioBlob) return

    try {
      setIsUploading(true)
      const file = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })
      const uploaded = await startUpload([file])

      if (uploaded && uploaded[0]?.url) {
        onRecordingComplete(uploaded[0].url)
        setAudioBlob(null)
        setAudioUrl(null)
        setRecordingTime(0)
      }
    } catch (error) {
      console.error('Error uploading audio:', error)
      alert('Failed to upload audio. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsRecording(false)
    onCancel()
  }

  return (
    <div className="p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      {!audioBlob ? (
        <>
          {!isRecording ? (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full h-12 w-12 p-0"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Click to start recording</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your voice will be recorded</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full h-12 w-12 p-0 animate-pulse"
              >
                <Square className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Recording...</p>
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{formatTime(recordingTime)}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click stop when finished</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <audio 
              src={audioUrl || undefined} 
              controls 
              controlsList="nodownload nofullscreen noplaybackrate" 
              className="flex-1 h-10"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isUploading || isUploadThingUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={isUploading || isUploadThingUploading}
              className="bg-[#003366] hover:bg-[#002244] text-white"
            >
              {(isUploading || isUploadThingUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Use This Recording'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function BlogPostContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user, isLoaded: isUserLoaded } = useUser()
  const postId = params.id as string
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const replyInputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})
  
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("article")
  const [commentText, setCommentText] = useState("")
  const [commentAudioUrl, setCommentAudioUrl] = useState<string | null>(null)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replyAudioUrl, setReplyAudioUrl] = useState<string | null>(null)
  const [showReplyVoiceRecorder, setShowReplyVoiceRecorder] = useState<string | null>(null)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)
  
  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState(1.0)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Get user's name from session
  const userName = user
    ? user.fullName || 
      user.firstName || 
      user.username || 
      user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
      'Anonymous'
    : null

  // Fetch blog post using React Query
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: () => fetchBlogPost(postId),
    enabled: !!postId,
    staleTime: 60000, // 1 minute
  })

  // Fetch comments for the blog post
  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['blogComments', postId],
    queryFn: () => fetchComments(postId, post?.author.name),
    enabled: !!postId,
    staleTime: 30000,
  })

  // Fetch all posts for related posts
  const { data: allPosts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchAllBlogPosts,
    staleTime: 60000,
  })

  // Fetch bookmark status
  const { data: bookmarkData } = useQuery({
    queryKey: ['blogBookmark', postId],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${postId}/bookmark`)
      if (!response.ok) {
        return { isBookmarked: false }
      }
      return response.json()
    },
    enabled: !!postId && !!user,
    staleTime: 30000,
  })

  // Fetch like status
  const { data: likeData } = useQuery({
    queryKey: ['blogLike', postId],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${postId}/like`)
      if (!response.ok) {
        return { isLiked: false }
      }
      return response.json()
    },
    enabled: !!postId && !!user,
    staleTime: 30000,
  })

  // Fetch follow status
  const { data: followData } = useQuery({
    queryKey: ['authorFollow', post?.author.name],
    queryFn: async () => {
      if (!post?.author.name) return { isFollowing: false }
      const encodedAuthorName = encodeURIComponent(post.author.name)
      const response = await fetch(`/api/blog/authors/${encodedAuthorName}/follow`)
      if (!response.ok) {
        return { isFollowing: false }
      }
      return response.json()
    },
    enabled: !!post?.author.name && !!user,
    staleTime: 30000,
  })

  // Update local state based on fetched data
  useEffect(() => {
    if (bookmarkData !== undefined) {
      setIsSaved(bookmarkData.isBookmarked || false)
    }
  }, [bookmarkData])

  useEffect(() => {
    if (likeData !== undefined) {
      setIsLiked(likeData.isLiked || false)
    }
  }, [likeData])

  useEffect(() => {
    if (followData !== undefined) {
      setIsFollowing(followData.isFollowing || false)
    }
  }, [followData])

  // Mutation for submitting comments
  const commentMutation = useMutation({
    mutationFn: async ({ comment, comment_by, parent_id, audio_url }: { comment: string; comment_by: string; parent_id?: string; audio_url?: string | null }) => {
      const response = await fetch(`/api/blog-posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, comment_by, parent_id, audio_url: audio_url || null }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit comment')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', postId] })
      queryClient.invalidateQueries({ queryKey: ['blogPost', postId] })
      setCommentText('')
      setCommentAudioUrl(null)
      setReplyText('')
      setReplyAudioUrl(null)
      setReplyingTo(null)
      setShowVoiceRecorder(false)
      setShowReplyVoiceRecorder(null)
      
      // Update engagement when user comments
      if (postId) {
        fetch(`/api/blog-posts/${postId}/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'comment' }),
        }).catch(error => {
          console.error('Error updating engagement:', error)
        })
      }
      
      toast({
        title: "Comment posted!",
        description: "Your comment has been successfully posted.",
        duration: 3000,
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to post comment",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  // Mutation for liking comments
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/blog-posts/${postId}/comments/${commentId}/like`, {
        method: 'PUT',
      })
      if (!response.ok) {
        throw new Error('Failed to like comment')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', postId] })
    },
    onError: (error) => {
      toast({
        title: "Failed to like comment",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  // Handle like comment
  const handleLikeComment = (commentId: string) => {
    if (!user || !isUserLoaded) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments.",
        variant: "destructive",
        duration: 3000,
      })
      router.push('/sign-in')
      return
    }

    // Prevent double-liking (in a real app, you'd track this server-side)
    if (likedComments.has(commentId)) {
      toast({
        title: "Already liked",
        description: "You've already liked this comment.",
        duration: 2000,
      })
      return
    }

    likeCommentMutation.mutate(commentId)
    setLikedComments(prev => new Set(prev).add(commentId))
  }

  // Handle reply
  const handleReply = (commentId: string) => {
    if (!user || !isUserLoaded) {
      toast({
        title: "Sign in required",
        description: "Please sign in to reply to comments.",
        variant: "destructive",
        duration: 3000,
      })
      router.push('/sign-in')
      return
    }
    setReplyingTo(commentId)
  }

  // Handle submit reply
  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault()

    const currentReplyAudioUrl = showReplyVoiceRecorder === parentId ? replyAudioUrl : null

    if (!replyText.trim() && !currentReplyAudioUrl) {
      toast({
        title: "Reply cannot be empty",
        description: "Please enter a reply or record a voice message before submitting.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (!userName) {
      toast({
        title: "User information not available",
        description: "Please try again or refresh the page.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    commentMutation.mutate({
      comment: replyText.trim() || '[Voice message]',
      comment_by: userName,
      parent_id: parentId,
      audio_url: currentReplyAudioUrl,
    })
  }

  // Get related posts (same category or tags)
  const relatedPosts = post
    ? allPosts
          .filter(
            (p) =>
            p.id !== post.id &&
            (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))),
          )
          .slice(0, 3)
    : []

  // Handle emoji selection for main comment
  const handleEmojiSelect = (emoji: string) => {
    const textarea = commentInputRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = commentText
      const newText = text.substring(0, start) + emoji + text.substring(end)
      setCommentText(newText)
      
      // Focus back on textarea and set cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
      } else {
      setCommentText(commentText + emoji)
    }
  }

  // Handle emoji selection for replies
  const handleReplyEmojiSelect = (emoji: string, commentId: string) => {
    const textarea = replyInputRefs.current[commentId]
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = replyText
      const newText = text.substring(0, start) + emoji + text.substring(end)
      setReplyText(newText)
      
      // Focus back on textarea and set cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    } else {
      setReplyText(replyText + emoji)
    }
  }

  // Track views when page loads (only once per page load)
  const hasTrackedView = useRef(false)
  useEffect(() => {
    if (post?.id && postId && !hasTrackedView.current) {
      hasTrackedView.current = true
      
      // Track view
      fetch(`/api/blog-posts/${postId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `Failed to track view: ${response.status} ${response.statusText}`)
        }
        return response.json()
      })
      .then(() => {
        // After view is tracked, update engagement
        return fetch(`/api/blog-posts/${postId}/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        })
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `Failed to update engagement: ${response.status} ${response.statusText}`)
        }
        // Invalidate queries to refresh view count
        queryClient.invalidateQueries({ queryKey: ['blogPost', postId] })
      })
      .catch(error => {
        console.error('Error tracking view/engagement:', error)
        // Don't show toast for tracking errors as they're not critical for user experience
      })
    }
  }, [post?.id, postId, queryClient])

  // Track reading progress and update engagement
  const lastEngagementUpdate = useRef<number>(0)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(progress)

      // Update engagement based on reading progress (every 25% progress, with throttling)
      const currentProgress = Math.floor(progress / 25) * 25
      if (currentProgress > lastEngagementUpdate.current && post?.id && currentProgress > 0) {
        lastEngagementUpdate.current = currentProgress
        
        fetch(`/api/blog-posts/${postId}/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'read_time',
            readTimeProgress: currentProgress
          }),
        }).catch(error => {
          console.error('Error updating engagement:', error)
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [post?.id, postId])

  // Mutation for bookmark
  const bookmarkMutation = useMutation({
    mutationFn: async (isBookmarking: boolean) => {
      const method = isBookmarking ? 'POST' : 'DELETE'
      const response = await fetch(`/api/blog-posts/${postId}/bookmark`, {
        method,
      })
      if (!response.ok) {
        throw new Error(`Failed to ${isBookmarking ? 'bookmark' : 'unbookmark'} post`)
      }
      return response.json()
    },
    onSuccess: (data, isBookmarking) => {
      setIsSaved(isBookmarking)
      queryClient.invalidateQueries({ queryKey: ['blogBookmark', postId] })
      toast({
        title: isBookmarking ? "Post saved to bookmarks" : "Post removed from bookmarks",
        description: isBookmarking ? "You can find it in your saved posts." : "You can always save it again later.",
        duration: 3000,
      })
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

  // Mutation for like
  const likeMutation = useMutation({
    mutationFn: async (isLiking: boolean) => {
      const method = isLiking ? 'POST' : 'DELETE'
      const response = await fetch(`/api/blog-posts/${postId}/like`, {
        method,
      })
      if (!response.ok) {
        throw new Error(`Failed to ${isLiking ? 'like' : 'unlike'} post`)
      }
      return response.json()
    },
    onSuccess: async (data, isLiking) => {
      setIsLiked(isLiking)
      queryClient.invalidateQueries({ queryKey: ['blogLike', postId] })
      queryClient.invalidateQueries({ queryKey: ['blogPost', postId] })
      
      // Update engagement when user likes/unlikes
      if (post?.id) {
        try {
          await fetch(`/api/blog-posts/${postId}/engagement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like' }),
          })
        } catch (error) {
          console.error('Error updating engagement:', error)
        }
      }

      toast({
        title: isLiking ? "Post liked" : "Post unliked",
        duration: 2000,
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to update like",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  // Mutation for follow
  const followMutation = useMutation({
    mutationFn: async (isFollowing: boolean) => {
      if (!post?.author.name) throw new Error('Author name not available')
      const encodedAuthorName = encodeURIComponent(post.author.name)
      const method = isFollowing ? 'POST' : 'DELETE'
      const response = await fetch(`/api/blog/authors/${encodedAuthorName}/follow`, {
        method,
      })
      if (!response.ok) {
        throw new Error(`Failed to ${isFollowing ? 'follow' : 'unfollow'} author`)
      }
      return response.json()
    },
    onSuccess: (data, isFollowing) => {
      setIsFollowing(isFollowing)
      queryClient.invalidateQueries({ queryKey: ['authorFollow', post?.author.name] })
      toast({
        title: isFollowing ? "Following author" : "Unfollowed author",
        description: isFollowing 
          ? `You're now following ${post?.author.name}. You'll get updates on their new articles.`
          : `You've unfollowed ${post?.author.name}.`,
        duration: 3000,
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to update follow status",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  // Handle save/bookmark post
  const toggleSavePost = () => {
    if (!user || !isUserLoaded) {
    toast({
        title: "Sign in required",
        description: "Please sign in to bookmark posts.",
        variant: "destructive",
      duration: 3000,
    })
      router.push('/sign-in')
      return
    }

    bookmarkMutation.mutate(!isSaved)
  }

  // Handle like post
  const toggleLikePost = () => {
    if (!user || !isUserLoaded) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts.",
        variant: "destructive",
        duration: 3000,
      })
      router.push('/sign-in')
      return
    }

    likeMutation.mutate(!isLiked)
  }

  // Handle follow author
  const toggleFollowAuthor = () => {
    if (!user || !isUserLoaded) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow authors.",
        variant: "destructive",
        duration: 3000,
      })
      router.push('/sign-in')
      return
    }

    if (!post?.author.name) {
      toast({
        title: "Error",
        description: "Author information not available.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    followMutation.mutate(!isFollowing)
  }

  // Handle share post
  const handleShare = async (platform: string) => {
    if (!post) return

    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareTitle = post.title
    const shareText = post.excerpt || post.title
    const shareUrl = currentUrl

    // Update engagement when user shares
    if (post?.id) {
      try {
        await fetch(`/api/blog-posts/${postId}/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'share' }),
        })
      } catch (error) {
        console.error('Error updating engagement:', error)
      }
    }

    try {
      if (platform === "Copy Link") {
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
      } else if (platform === "Native Share") {
        // Use Web Share API if available
        if (typeof navigator !== 'undefined' && navigator.share) {
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
          }
        } else {
          toast({
            title: "Native share not available",
            description: "Your device doesn't support native sharing.",
            variant: "destructive",
            duration: 3000,
          })
        }
      } else {
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
    }
  }

  // Strip HTML tags and get plain text for TTS
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Check if native share is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'share' in navigator) {
      setSupportsNativeShare(true)
    }
  }, [])

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }, [])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [])

  // Handle start/stop reading
  const handleStartReading = () => {
    if (!post) {
      toast({
        title: "No article content",
        description: "Article content is not available.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Check if speech synthesis is available
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast({
        title: "Text-to-speech not available",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (!speechSynthesisRef.current) {
      speechSynthesisRef.current = window.speechSynthesis
    }

    const text = stripHtml(post.content)
    
    if (!text.trim()) {
      toast({
        title: "No content to read",
        description: "The article content is empty.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Cancel any ongoing speech
    if (speechSynthesisRef.current.speaking || speechSynthesisRef.current.pending) {
      speechSynthesisRef.current.cancel()
      // Wait a bit for cancellation to complete
      setTimeout(() => {
        startSpeechSynthesis(text)
      }, 100)
    } else {
      startSpeechSynthesis(text)
    }
  }

  // Helper function to start speech synthesis
  const startSpeechSynthesis = (text: string) => {
    if (!speechSynthesisRef.current) return

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = speechRate
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        utteranceRef.current = null
      }

      utterance.onerror = (event) => {
        // Handle different error types
        let errorMessage = "An error occurred while reading the article."
        let shouldShowError = true
        
        if (event.error) {
          const errorCode = event.error as string
          switch (errorCode) {
            case 'network':
              errorMessage = "Network error. Please check your internet connection."
              break
            case 'synthesis':
            case 'synthesis-failed':
              errorMessage = "Speech synthesis failed. Please try again."
              break
            case 'synthesis-unavailable':
              errorMessage = "Speech synthesis is not available. Please try a different browser."
              break
            case 'audio-busy':
              errorMessage = "Audio is busy. Please wait and try again."
              break
            case 'audio-hardware':
              errorMessage = "Audio hardware error. Please check your audio settings."
              break
            case 'not-allowed':
              errorMessage = "Permission denied. Please allow audio playback."
              break
            case 'interrupted':
            case 'canceled':
              // User canceled, don't show error toast
              shouldShowError = false
              break
            default:
              errorMessage = `Speech error: ${errorCode}. Please try again.`
          }

          // Only log if there's actual error information
          if (shouldShowError) {
            console.error('Speech synthesis error:', {
              error: event.error,
              type: event.type,
              charIndex: event.charIndex,
              charLength: event.charLength,
              elapsedTime: event.elapsedTime,
            })
          }
        }

        setIsSpeaking(false)
        setIsPaused(false)
        utteranceRef.current = null

        // Only show error toast for actual errors, not cancellations
        if (shouldShowError) {
          toast({
            title: "Error reading article",
            description: errorMessage,
            variant: "destructive",
            duration: 4000,
          })
        }
      }

      utteranceRef.current = utterance
      speechSynthesisRef.current.speak(utterance)
    } catch (error) {
      console.error('Error creating speech utterance:', error)
      setIsSpeaking(false)
      setIsPaused(false)
      toast({
        title: "Error reading article",
        description: error instanceof Error ? error.message : "Failed to start speech synthesis. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Handle pause/resume reading
  const handlePauseReading = () => {
    if (!speechSynthesisRef.current) return

    if (speechSynthesisRef.current.speaking && !speechSynthesisRef.current.paused) {
      speechSynthesisRef.current.pause()
      setIsPaused(true)
    } else if (speechSynthesisRef.current.paused) {
      speechSynthesisRef.current.resume()
      setIsPaused(false)
    }
  }

  // Handle stop reading
  const handleStopReading = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
    }
  }

  // Handle submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !isUserLoaded) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a comment.",
        variant: "destructive",
        duration: 3000,
      })
      router.push('/sign-in')
      return
    }

    if (!commentText.trim() && !commentAudioUrl) {
      toast({
        title: "Comment cannot be empty",
        description: "Please enter a comment or record a voice message before submitting.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (!userName) {
      toast({
        title: "User information not available",
        description: "Please try again or refresh the page.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    commentMutation.mutate({
      comment: commentText.trim() || '[Voice message]',
      comment_by: userName,
      audio_url: commentAudioUrl,
    })
  }

  if (isLoading) {
    return <BlogPostSkeleton />
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#003366] dark:text-white">Post not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error ? 'Failed to load blog post. Please try again later.' : "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.push("/blog")} className="bg-[#003366] hover:bg-[#002244]">
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div className="h-full bg-[#00CC66]" style={{ width: `${readingProgress}%` }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 bg-gradient-to-br from-[#003366] to-[#002244] text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white bg-grid-8 opacity-10"></div>
          <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[140%] bg-[#00CC66]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[140%] bg-[#00CC66]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={() => router.push("/blog")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 bg-[#00CC66] hover:bg-[#00BB55] px-3 py-1">{post.category}</Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center text-white/80 text-sm mb-8 gap-y-2">
                <div className="flex items-center mr-6">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center mr-6">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center mr-6">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{post.likes} likes</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post.comments} comments</span>
                </div>
              </div>

              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4 border-2 border-[#00CC66]">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{post.author.name}</div>
                  {post.author.role && <div className="text-sm text-white/70">{post.author.role}</div>}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="relative -mt-16 mb-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar - Social Share */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 flex lg:flex-col items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#003366] hover:text-white hover:border-[#003366] dark:hover:bg-[#003366] dark:hover:text-white dark:hover:border-[#003366]"
                  onClick={() => handleShare("Facebook")}
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#003366] hover:text-white hover:border-[#003366] dark:hover:bg-[#003366] dark:hover:text-white dark:hover:border-[#003366]"
                  onClick={() => handleShare("Twitter")}
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#003366] hover:text-white hover:border-[#003366] dark:hover:bg-[#003366] dark:hover:text-white dark:hover:border-[#003366]"
                  onClick={() => handleShare("LinkedIn")}
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#003366] hover:text-white hover:border-[#003366] dark:hover:bg-[#003366] dark:hover:text-white dark:hover:border-[#003366]"
                  onClick={() => handleShare("Copy Link")}
                >
                  <Copy className="h-5 w-5" />
                </Button>
                {supportsNativeShare && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#00CC66] hover:text-white hover:border-[#00CC66] dark:hover:bg-[#00CC66] dark:hover:text-white dark:hover:border-[#00CC66]"
                    onClick={() => handleShare("Native Share")}
                    title="Share via..."
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                )}
                <Separator className="hidden lg:block w-8 h-[1px] my-2 bg-gray-200 dark:bg-gray-700" />
                <Button
                  size="icon"
                  variant={isSaved ? "default" : "outline"}
                  className={`rounded-full h-10 w-10 ${
                    isSaved
                      ? "bg-[#00CC66] hover:bg-[#00BB55] text-white border-[#00CC66]"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#00CC66] hover:text-white hover:border-[#00CC66] dark:hover:bg-[#00CC66] dark:hover:text-white dark:hover:border-[#00CC66]"
                  }`}
                  onClick={toggleSavePost}
                  disabled={bookmarkMutation.isPending}
                >
                  {bookmarkMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isSaved ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant={isLiked ? "default" : "outline"}
                  className={`rounded-full h-10 w-10 ${
                    isLiked
                      ? "bg-[#00CC66] hover:bg-[#00BB55] text-white border-[#00CC66]"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#00CC66] hover:text-white hover:border-[#00CC66] dark:hover:bg-[#00CC66] dark:hover:text-white dark:hover:border-[#00CC66]"
                  }`}
                  onClick={toggleLikePost}
                  disabled={likeMutation.isPending}
                >
                  {likeMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                  <ThumbsUp className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger
                    value="article"
                    className="data-[state=active]:bg-[#003366] data-[state=active]:text-white"
                  >
                    Article
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="data-[state=active]:bg-[#003366] data-[state=active]:text-white"
                  >
                    Comments ({comments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="article" className="mt-6">
                  {/* Text-to-Speech Controls */}
                  {post && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-[#003366] dark:text-[#00CC66]" />
                        <span className="font-medium text-gray-900 dark:text-white">Listen to Article</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <label htmlFor="speech-rate" className="text-sm text-gray-600 dark:text-gray-400">
                            Speed:
                          </label>
                          <input
                            id="speech-rate"
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={speechRate}
                            onChange={(e) => {
                              const newRate = parseFloat(e.target.value)
                              setSpeechRate(newRate)
                              if (utteranceRef.current && speechSynthesisRef.current) {
                                utteranceRef.current.rate = newRate
                                if (speechSynthesisRef.current.speaking && !speechSynthesisRef.current.paused) {
                                  speechSynthesisRef.current.cancel()
                                  speechSynthesisRef.current.speak(utteranceRef.current)
                                }
                              }
                            }}
                            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003366]"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                            {speechRate.toFixed(1)}x
                          </span>
                        </div>
                        {!isSpeaking && !isPaused && (
                          <Button
                            onClick={handleStartReading}
                            className="bg-[#003366] hover:bg-[#002244] text-white"
                            size="sm"
                            disabled={typeof window === 'undefined' || !('speechSynthesis' in window)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Reading
                          </Button>
                        )}
                        {isSpeaking && !isPaused && (
                          <Button
                            onClick={handlePauseReading}
                            variant="outline"
                            size="sm"
                            className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        )}
                        {isPaused && (
                          <Button
                            onClick={handlePauseReading}
                            variant="outline"
                            size="sm"
                            className="border-[#00CC66] text-[#00CC66] hover:bg-[#00CC66] hover:text-white"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                        {(isSpeaking || isPaused) && (
                          <Button
                            onClick={handleStopReading}
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  )}

                  <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[#003366] dark:prose-headings:text-white prose-a:text-[#00CC66] dark:prose-a:text-[#00CC66] prose-a:no-underline hover:prose-a:underline prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-ul:text-gray-700 dark:prose-ul:text-gray-200 prose-ol:text-gray-700 dark:prose-ol:text-gray-200 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200 prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
                    <div className="text-gray-700 dark:text-gray-200 [&>p]:text-gray-700 dark:[&>p]:text-gray-200 [&>h1]:text-[#003366] dark:[&>h1]:text-white [&>h2]:text-[#003366] dark:[&>h2]:text-white [&>h3]:text-[#003366] dark:[&>h3]:text-white [&>h4]:text-[#003366] dark:[&>h4]:text-white [&>h5]:text-[#003366] dark:[&>h5]:text-white [&>h6]:text-[#003366] dark:[&>h6]:text-white [&>a]:text-[#00CC66] dark:[&>a]:text-[#00CC66] [&>strong]:text-gray-900 dark:[&>strong]:text-white [&>em]:text-gray-700 dark:[&>em]:text-gray-200 [&>li]:text-gray-700 dark:[&>li]:text-gray-200 [&>ul]:text-gray-700 dark:[&>ul]:text-gray-200 [&>ol]:text-gray-700 dark:[&>ol]:text-gray-200" dangerouslySetInnerHTML={{ __html: post.content }} />
                  </article>

                  <div className="mt-12 flex flex-wrap gap-2">
                    <span className="text-gray-600 dark:text-gray-400">Tags:</span>
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
                        <Badge
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 cursor-pointer"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>

                  <Separator className="my-12" />

                  {/* Author Bio */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <Avatar className="h-24 w-24 border-4 border-[#00CC66]">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-2">{post.author.name}</h3>
                        {post.author.role && <p className="text-gray-600 dark:text-gray-400 mb-4">{post.author.role}</p>}
                        {post.author.bio && <p className="text-gray-700 dark:text-gray-300">{post.author.bio}</p>}
                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant={isFollowing ? "default" : "outline"} 
                            size="sm" 
                            className={
                              isFollowing
                                ? "bg-[#00CC66] hover:bg-[#00BB55] text-white border-[#00CC66]"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }
                            onClick={toggleFollowAuthor}
                            disabled={followMutation.isPending}
                          >
                            {followMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isFollowing ? "Unfollowing..." : "Following..."}
                              </>
                            ) : isFollowing ? (
                              <>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                            Follow
                              </>
                            )}
                          </Button>
                          <Button size="sm" className="bg-[#003366] hover:bg-[#002244] text-white">
                            View All Articles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="mt-6">
                  {/* Comment Form */}
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-[#003366] dark:text-white mb-3 md:mb-4">Leave a Comment</h3>
                    {!user || !isUserLoaded ? (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6 text-center">
                        <MessageSquare className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-400 mb-3 md:mb-4" />
                        <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">Sign in to comment</h4>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4">Please sign in to post a comment on this article.</p>
                        <Button
                          onClick={() => router.push('/sign-in')}
                          className="bg-[#003366] hover:bg-[#002244] text-sm md:text-base"
                        >
                          Sign In
                        </Button>
                      </div>
                    ) : (
                    <form onSubmit={handleSubmitComment}>
                        {userName && (
                          <div className="mb-2 md:mb-3 flex flex-wrap items-center gap-1 md:gap-2">
                            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Commenting as:</span>
                            <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</span>
                          </div>
                        )}
                        <div className="relative">
                      <textarea
                            ref={commentInputRef}
                            className="w-full p-3 md:p-4 pr-12 md:pr-14 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC66] focus:border-transparent bg-white dark:bg-gray-800 !text-gray-900 dark:!text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm md:text-base"
                        rows={4}
                            placeholder="Share your thoughts... 😊"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      ></textarea>
                          <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 z-10">
                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                          </div>
                        </div>
                        <div className="mt-2 md:mt-3">
                          {!showVoiceRecorder ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 md:h-9 px-3 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              onClick={() => {
                                setShowVoiceRecorder(true)
                                setCommentAudioUrl(null)
                              }}
                            >
                              <Mic className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              <span className="text-xs md:text-sm">Record Voice</span>
                            </Button>
                          ) : (
                            <VoiceRecorder
                              onRecordingComplete={(audioUrl) => {
                                setCommentAudioUrl(audioUrl)
                                setShowVoiceRecorder(false)
                              }}
                              onCancel={() => {
                                setShowVoiceRecorder(false)
                                setCommentAudioUrl(null)
                              }}
                            />
                          )}
                        </div>
                      <div className="mt-2 md:mt-3 flex justify-end">
                        <Button
                          type="submit"
                          className="h-9 md:h-10 px-4 md:px-6 text-sm md:text-base bg-[#003366] hover:bg-[#002244]"
                            disabled={(!commentText.trim() && !commentAudioUrl) || commentMutation.isPending}
                          >
                            {commentMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className="text-sm md:text-base">Posting...</span>
                              </>
                            ) : (
                              <span className="text-sm md:text-base">Post Comment</span>
                            )}
                        </Button>
                      </div>
                    </form>
                    )}
                  </div>

                  {/* Comments List */}
                  {isLoadingComments ? (
                    <div className="space-y-4 md:space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-6">
                          <div className="flex items-start gap-2 md:gap-4">
                            <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-2 min-w-0">
                              <Skeleton className="h-4 w-24 md:w-32" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 md:py-12 px-4">
                      <MessageSquare className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3 md:mb-4" />
                      <h4 className="text-base md:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No comments yet</h4>
                      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                  <div className="space-y-4 md:space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-6">
                        <div className="flex items-start gap-2 md:gap-4">
                          <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                            <AvatarFallback className="text-xs md:text-sm">{comment.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <div className="flex flex-wrap items-center gap-1 md:gap-2 min-w-0">
                                <span className="font-medium text-sm md:text-base text-gray-900 dark:text-white truncate">{comment.author.name}</span>
                                {comment.author.isAuthor && <Badge className="bg-[#00CC66] text-xs flex-shrink-0">Author</Badge>}
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{comment.date}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`h-7 md:h-8 px-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex-shrink-0 ${likedComments.has(comment.id) ? 'text-[#00CC66] dark:text-[#00CC66]' : ''}`}
                                onClick={() => handleLikeComment(comment.id)}
                                disabled={likeCommentMutation.isPending}
                              >
                                <ThumbsUp className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                                <span className="text-xs md:text-sm">{comment.likes}</span>
                              </Button>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
                            {comment.audioUrl && (
                              <div className="mt-3">
                                <audio 
                                  src={comment.audioUrl} 
                                  controls 
                                  controlsList="nodownload nofullscreen noplaybackrate" 
                                  className="w-full h-8 md:h-10"
                                  onContextMenu={(e) => e.preventDefault()}
                                />
                              </div>
                            )}
                            <div className="mt-3 flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => handleReply(comment.id)}
                              >
                                Reply
                              </Button>
                            </div>

                            {/* Reply Form */}
                            {replyingTo === comment.id && (
                              <div className="mt-3 md:mt-4 pl-2 md:pl-4 lg:pl-6 border-l-2 border-[#00CC66]">
                                <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3 md:mt-4">
                                  <div className="relative">
                                    <textarea
                                      ref={(el) => {
                                        if (el) {
                                          replyInputRefs.current[comment.id] = el
                                        }
                                      }}
                                      className="w-full p-2 md:p-3 pr-12 md:pr-14 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC66] focus:border-transparent bg-white dark:bg-gray-800 !text-gray-900 dark:!text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-xs md:text-sm"
                                      rows={3}
                                      placeholder="Write a reply... 😊"
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                    ></textarea>
                                    <div className="absolute bottom-2 right-2 z-10">
                                      <EmojiPicker onEmojiSelect={(emoji) => handleReplyEmojiSelect(emoji, comment.id)} />
                                    </div>
                                  </div>
                                  <div className="mt-2 flex flex-col sm:flex-row gap-2 justify-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 md:h-8 px-3 text-xs md:text-sm w-full sm:w-auto"
                                      onClick={() => {
                                        setReplyingTo(null)
                                        setReplyText('')
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      size="sm"
                                      className="h-7 md:h-8 px-3 md:px-4 text-xs md:text-sm bg-[#003366] hover:bg-[#002244] w-full sm:w-auto"
                                      disabled={(!replyText.trim() && !(showReplyVoiceRecorder === comment.id && replyAudioUrl)) || commentMutation.isPending}
                                    >
                                      {commentMutation.isPending ? (
                                        <>
                                          <Loader2 className="mr-1 md:mr-2 h-3 w-3 animate-spin" />
                                          <span className="text-xs md:text-sm">Posting...</span>
                                        </>
                                      ) : (
                                        <span className="text-xs md:text-sm">Post Reply</span>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="mt-2">
                                    {!showReplyVoiceRecorder || showReplyVoiceRecorder !== comment.id ? (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 md:h-8 px-2 md:px-3 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        onClick={() => {
                                          setShowReplyVoiceRecorder(comment.id)
                                          setReplyAudioUrl(null)
                                        }}
                                      >
                                        <Mic className="h-3 w-3 mr-1" />
                                        <span className="text-xs">Record Voice</span>
                                      </Button>
                                    ) : (
                                      <VoiceRecorder
                                        onRecordingComplete={(audioUrl) => {
                                          setReplyAudioUrl(audioUrl)
                                        }}
                                        onCancel={() => {
                                          setShowReplyVoiceRecorder(null)
                                          setReplyAudioUrl(null)
                                        }}
                                      />
                                    )}
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* Replies */}
                            {comment.replies.length > 0 && (
                              <div className="mt-3 md:mt-4 pl-2 md:pl-4 lg:pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3 md:space-y-4">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="bg-white dark:bg-gray-900 rounded-lg p-2 md:p-4">
                                    <div className="flex items-start gap-2 md:gap-3">
                                      <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
                                        <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                                        <AvatarFallback className="text-xs">{reply.author.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 md:gap-2 mb-1">
                                          <div className="flex flex-wrap items-center gap-1 md:gap-2 min-w-0">
                                            <span className="font-medium text-xs md:text-sm text-gray-900 dark:text-white truncate">{reply.author.name}</span>
                                          {reply.author.isAuthor && (
                                            <Badge className="bg-[#00CC66] text-xs flex-shrink-0">Author</Badge>
                                          )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{reply.date}</span>
                                        </div>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className={`h-6 md:h-7 px-1.5 md:px-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex-shrink-0 ${likedComments.has(reply.id) ? 'text-[#00CC66] dark:text-[#00CC66]' : ''}`}
                                            onClick={() => handleLikeComment(reply.id)}
                                            disabled={likeCommentMutation.isPending}
                                          >
                                            <ThumbsUp className={`h-3 w-3 mr-0.5 md:mr-1 ${likedComments.has(reply.id) ? 'fill-current' : ''}`} />
                                          <span className="text-xs">{reply.likes}</span>
                                        </Button>
                                      </div>
                                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{reply.content}</p>
                                        {reply.audioUrl && (
                                          <div className="mt-2">
                                            <audio 
                                              src={reply.audioUrl} 
                                              controls 
                                              controlsList="nodownload nofullscreen noplaybackrate" 
                                              className="w-full h-7 md:h-8"
                                              onContextMenu={(e) => e.preventDefault()}
                                            />
                                          </div>
                                        )}
                                        <div className="mt-2 flex gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 md:h-7 px-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                            onClick={() => handleReply(reply.id)}
                                          >
                                            Reply
                                          </Button>
                                        </div>

                                        {/* Nested Reply Form */}
                                        {replyingTo === reply.id && (
                                          <div className="mt-2 md:mt-3 ml-1 md:ml-2 pl-2 md:pl-3 lg:pl-4 border-l-2 border-[#00CC66]">
                                            <form onSubmit={(e) => handleSubmitReply(e, reply.id)} className="mt-2 md:mt-3">
                                              <div className="relative">
                                                <textarea
                                                  ref={(el) => {
                                                    if (el) {
                                                      replyInputRefs.current[reply.id] = el
                                                    }
                                                  }}
                                                  className="w-full p-2 pr-12 md:pr-14 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC66] focus:border-transparent bg-white dark:bg-gray-800 !text-gray-900 dark:!text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-xs md:text-sm"
                                                  rows={2}
                                                  placeholder="Write a reply... 😊"
                                                  value={replyText}
                                                  onChange={(e) => setReplyText(e.target.value)}
                                                ></textarea>
                                                <div className="absolute bottom-2 right-2 z-10">
                                                  <EmojiPicker onEmojiSelect={(emoji) => handleReplyEmojiSelect(emoji, reply.id)} />
                                                </div>
                                              </div>
                                              <div className="mt-2 flex flex-col sm:flex-row gap-1.5 md:gap-2 justify-end">
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-6 md:h-7 px-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full sm:w-auto"
                                                  onClick={() => {
                                                    setReplyingTo(null)
                                                    setReplyText('')
                                                  }}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  type="submit"
                                                  size="sm"
                                                  className="h-6 md:h-7 px-2 md:px-3 text-xs bg-[#003366] hover:bg-[#002244] text-white w-full sm:w-auto"
                                                  disabled={(!replyText.trim() && !(showReplyVoiceRecorder === reply.id && replyAudioUrl)) || commentMutation.isPending}
                                                >
                                                  {commentMutation.isPending ? (
                                                    <>
                                                      <Loader2 className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3 animate-spin" />
                                                      <span className="text-xs">Posting...</span>
                                                    </>
                                                  ) : (
                                                    <span className="text-xs">Post Reply</span>
                                                  )}
                                                </Button>
                                              </div>
                                              <div className="mt-2">
                                                {!showReplyVoiceRecorder || showReplyVoiceRecorder !== reply.id ? (
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-6 md:h-7 px-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                    onClick={() => {
                                                      setShowReplyVoiceRecorder(reply.id)
                                                      setReplyAudioUrl(null)
                                                    }}
                                                  >
                                                    <Mic className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">Record Voice</span>
                                                  </Button>
                                                ) : (
                                                  <VoiceRecorder
                                                    onRecordingComplete={(audioUrl) => {
                                                      setReplyAudioUrl(audioUrl)
                                                    }}
                                                    onCancel={() => {
                                                      setShowReplyVoiceRecorder(null)
                                                      setReplyAudioUrl(null)
                                                    }}
                                                  />
                                                )}
                                              </div>
                                            </form>
                                          </div>
                                        )}

                                        {/* Nested Replies (replies to replies) */}
                                        {reply.replies && reply.replies.length > 0 && (
                                          <div className="mt-2 md:mt-3 ml-1 md:ml-2 pl-2 md:pl-3 lg:pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-2 md:space-y-3">
                                            {reply.replies.map((nestedReply) => (
                                              <div key={nestedReply.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 md:p-3">
                                                <div className="flex items-start gap-1.5 md:gap-2">
                                                  <Avatar className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0">
                                                    <AvatarImage src={nestedReply.author.avatar} alt={nestedReply.author.name} />
                                                    <AvatarFallback className="text-xs">{nestedReply.author.name.charAt(0)}</AvatarFallback>
                                                  </Avatar>
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                                      <div className="flex flex-wrap items-center gap-1 min-w-0">
                                                        <span className="font-medium text-gray-900 dark:text-white text-xs md:text-sm truncate">{nestedReply.author.name}</span>
                                                        {nestedReply.author.isAuthor && (
                                                          <Badge className="bg-[#00CC66] text-xs flex-shrink-0">Author</Badge>
                                                        )}
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{nestedReply.date}</span>
                                                      </div>
                                                      <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className={`h-5 md:h-6 px-1 md:px-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex-shrink-0 ${likedComments.has(nestedReply.id) ? 'text-[#00CC66] dark:text-[#00CC66]' : ''}`}
                                                        onClick={() => handleLikeComment(nestedReply.id)}
                                                        disabled={likeCommentMutation.isPending}
                                                      >
                                                        <ThumbsUp className={`h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 ${likedComments.has(nestedReply.id) ? 'fill-current' : ''}`} />
                                                        <span className="text-xs">{nestedReply.likes}</span>
                                                      </Button>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap break-words">{nestedReply.content}</p>
                                                    {nestedReply.audioUrl && (
                                                      <div className="mt-1.5 md:mt-2">
                                                        <audio 
                                                          src={nestedReply.audioUrl} 
                                                          controls 
                                                          controlsList="nodownload nofullscreen noplaybackrate" 
                                                          className="w-full h-6 md:h-7"
                                                          onContextMenu={(e) => e.preventDefault()}
                                                        />
                                                      </div>
                                                    )}
                                                    <div className="mt-1.5 md:mt-2">
                                                      <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-5 md:h-6 px-1.5 md:px-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                        onClick={() => handleReply(nestedReply.id)}
                                                      >
                                                        Reply
                                                      </Button>
                                                    </div>

                                                    {/* Nested Reply Form for nested replies */}
                                                    {replyingTo === nestedReply.id && (
                                                      <div className="mt-2 ml-1 md:ml-2 pl-2 md:pl-3 border-l-2 border-[#00CC66]">
                                                        <form onSubmit={(e) => handleSubmitReply(e, nestedReply.id)} className="mt-2">
                                                          <div className="relative">
                                                            <textarea
                                                              ref={(el) => {
                                                                if (el) {
                                                                  replyInputRefs.current[nestedReply.id] = el
                                                                }
                                                              }}
                                                              className="w-full p-2 pr-12 md:pr-14 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC66] focus:border-transparent bg-white dark:bg-gray-800 !text-gray-900 dark:!text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-xs"
                                                              rows={2}
                                                              placeholder="Write a reply... 😊"
                                                              value={replyText}
                                                              onChange={(e) => setReplyText(e.target.value)}
                                                            ></textarea>
                                                            <div className="absolute bottom-2 right-2 z-10">
                                                              <EmojiPicker onEmojiSelect={(emoji) => handleReplyEmojiSelect(emoji, nestedReply.id)} />
                                                            </div>
                                                          </div>
                                                          <div className="mt-1.5 md:mt-2 flex flex-col sm:flex-row gap-1 justify-end">
                                                            <Button
                                                              type="button"
                                                              variant="ghost"
                                                              size="sm"
                                                              className="h-6 px-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full sm:w-auto"
                                                              onClick={() => {
                                                                setReplyingTo(null)
                                                                setReplyText('')
                                                              }}
                                                            >
                                                              Cancel
                                                            </Button>
                                                            <Button
                                                              type="submit"
                                                              size="sm"
                                                              className="h-6 px-2 md:px-3 text-xs bg-[#003366] hover:bg-[#002244] text-white w-full sm:w-auto"
                                                              disabled={(!replyText.trim() && !(showReplyVoiceRecorder === nestedReply.id && replyAudioUrl)) || commentMutation.isPending}
                                                            >
                                                              {commentMutation.isPending ? (
                                                                <>
                                                                  <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />
                                                                  <span className="text-xs">Posting...</span>
                                                                </>
                                                              ) : (
                                                                <span className="text-xs">Post</span>
                                                              )}
                                                            </Button>
                                                          </div>
                                                          <div className="mt-1.5">
                                                            {!showReplyVoiceRecorder || showReplyVoiceRecorder !== nestedReply.id ? (
                                                              <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-5 md:h-6 px-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                                onClick={() => {
                                                                  setShowReplyVoiceRecorder(nestedReply.id)
                                                                  setReplyAudioUrl(null)
                                                                }}
                                                              >
                                                                <Mic className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                                                                <span className="text-xs">Record</span>
                                                              </Button>
                                                            ) : (
                                                              <VoiceRecorder
                                                                onRecordingComplete={(audioUrl) => {
                                                                  setReplyAudioUrl(audioUrl)
                                                                }}
                                                                onCancel={() => {
                                                                  setShowReplyVoiceRecorder(null)
                                                                  setReplyAudioUrl(null)
                                                                }}
                                                              />
                                                            )}
                                                          </div>
                                                        </form>
                                                      </div>
                                                    )}
                                                  </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Related Posts */}
            <div className="lg:col-span-3 order-3">
              <div className="lg:sticky lg:top-24 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Card key={relatedPost.id} className="overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="relative h-24">
                            <Image
                              src={relatedPost.image || "/placeholder.svg"}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="col-span-2 p-3">
                            <Badge variant="outline" className="mb-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                              {relatedPost.category}
                            </Badge>
                            <Link href={`/blog/${relatedPost.id}`}>
                              <h4 className="font-medium text-[#003366] dark:text-white hover:text-[#00CC66] dark:hover:text-[#00CC66] transition-colors line-clamp-2 text-sm">
                                {relatedPost.title}
                              </h4>
                            </Link>
                            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{relatedPost.readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(allPosts.flatMap((p) => p.tags)))
                      .slice(0, 10)
                      .map((tag) => (
                        <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
                          <Badge
                            variant="outline"
                            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next/Previous Article Navigation */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const currentIndex = allPosts.findIndex((p) => p.id === post.id)
              const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : allPosts[allPosts.length - 1]
              const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : allPosts[0]
              
              return (
                <>
                  {previousPost && (
                    <Link href={`/blog/${previousPost.id}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Previous Article</div>
                        <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-2 line-clamp-2">
                          {previousPost.title}
                </h3>
                        <div className="mt-auto flex items-center text-[#00CC66] dark:text-[#00CC66]">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Read Article</span>
                </div>
              </div>
            </Link>
                  )}

                  {nextPost && (
                    <Link href={`/blog/${nextPost.id}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-right">Next Article</div>
                        <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-2 line-clamp-2 text-right">
                          {nextPost.title}
                </h3>
                        <div className="mt-auto flex items-center justify-end text-[#00CC66] dark:text-[#00CC66]">
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function BlogPostPage() {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent />
    </Suspense>
  )
}

