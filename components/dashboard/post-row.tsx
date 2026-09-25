'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { PostActionDialog } from './post-action-dialog'

interface PostRowProps {
  post: {
    id: string
    title: string
    category: string
    views: number
    likes: number
    comments: number
    engagement: number
    status: 'draft' | 'published'
    date: string
    image: string
  }
}

export function PostRow({ post }: PostRowProps) {
  const [actionDialog, setActionDialog] = useState<{
    action: 'schedule' | 'analytics' | 'delete' | null
    open: boolean
  }>({ action: null, open: false })

  const openAction = (action: 'schedule' | 'analytics' | 'delete') => {
    setActionDialog({ action, open: true })
  }

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={post.image || "/placeholder.svg"} 
              alt={post.title}
              className="w-10 h-10 rounded-md object-cover"
            />
            <span className="font-medium text-foreground">{post.title}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-muted-foreground text-sm">{post.category}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-foreground font-medium">{post.views.toLocaleString()}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-foreground font-medium">{post.likes.toLocaleString()}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-foreground font-medium">{post.comments}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-foreground font-medium">{post.engagement.toFixed(1)}%</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-muted-foreground text-sm">{post.date}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            post.status === 'published' 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'bg-amber-500/10 text-amber-500'
          }`}>
            {post.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </td>
        <td className="px-6 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Edit Post</DropdownMenuItem>
              {post.status === 'draft' && <DropdownMenuItem>Publish</DropdownMenuItem>}
              {post.status === 'published' && <DropdownMenuItem>Unpublish</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openAction('schedule')}>
                Schedule Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAction('analytics')}>
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={() => openAction('delete')}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <PostActionDialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
        action={actionDialog.action}
        postTitle={post.title}
      />
    </>
  )
}
