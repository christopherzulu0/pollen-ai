'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PostRow } from './post-row'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type PostStatus = 'all' | 'draft' | 'published'
type SortBy = 'recent' | 'views' | 'engagement'

export function PostsTable() {
  const [status, setStatus] = useState<PostStatus>('all')
  const [sortBy, setSortBy] = useState<SortBy>('recent')

  const allPosts = [
    {
      id: '1',
      title: 'Getting Started with Next.js 15',
      category: 'Development',
      views: 2543,
      likes: 342,
      comments: 45,
      engagement: 15.2,
      status: 'published' as const,
      date: 'Nov 15, 2025',
      image: '/next-js-logo.jpg'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      category: 'React',
      views: 1843,
      likes: 287,
      comments: 32,
      engagement: 12.8,
      status: 'published' as const,
      date: 'Nov 12, 2025',
      image: '/react-logo.jpg'
    },
    {
      id: '3',
      title: 'Mastering TypeScript Generics',
      category: 'TypeScript',
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      status: 'draft' as const,
      date: 'Nov 18, 2025',
      image: '/typescript-logo.jpg'
    },
    {
      id: '4',
      title: 'CSS Grid vs Flexbox: Deep Dive',
      category: 'CSS',
      views: 3124,
      likes: 521,
      comments: 67,
      engagement: 18.5,
      status: 'published' as const,
      date: 'Nov 10, 2025',
      image: '/css-logo.jpg'
    },
    {
      id: '5',
      title: 'Building Scalable Node APIs',
      category: 'Backend',
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      status: 'draft' as const,
      date: 'Nov 19, 2025',
      image: '/nodejs-logo.jpg'
    }
  ]

  let filteredPosts = status === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.status === status)

  if (sortBy === 'views') {
    filteredPosts = [...filteredPosts].sort((a, b) => b.views - a.views)
  } else if (sortBy === 'engagement') {
    filteredPosts = [...filteredPosts].sort((a, b) => b.engagement - a.engagement)
  } else {
    filteredPosts = [...filteredPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Your Posts</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button
              variant={status === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('all')}
            >
              All Posts
            </Button>
            <Button
              variant={status === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('published')}
            >
              Published
            </Button>
            <Button
              variant={status === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('draft')}
            >
              Drafts
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Sort by
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('recent')}>Most Recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('views')}>Most Views</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('engagement')}>Best Engagement</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Likes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Comments</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Engagement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No posts found. Create your first post to get started!</p>
        </div>
      )}
    </div>
  )
}
