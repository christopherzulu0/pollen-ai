"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CommunityFeedProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CommunityFeed({ className, ...props }: CommunityFeedProps) {
  const posts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40",
      group: "Lusaka Savings Group",
      content: "Just made my final contribution for this month! 🎉",
      time: "2 hours ago",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      author: "David K.",
      avatar: "/placeholder.svg?height=40&width=40",
      group: "Business Entrepreneurs",
      content: "Anyone interested in joining our next investment meeting?",
      time: "5 hours ago",
      likes: 8,
      comments: 7,
    },
  ]

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Community</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border border-border/50 p-3 bg-background/50"
          >
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{post.author}</div>
                  <div className="text-xs text-muted-foreground">{post.time}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{post.group}</span>
                </div>
                <p className="text-sm mt-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {post.comments}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <Button variant="outline" size="sm" className="w-full">
          View All Community Posts
        </Button>
      </CardContent>
    </Card>
  )
}

