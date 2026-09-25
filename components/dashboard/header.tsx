'use client'

import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { CreatePostDialog } from './create-post-dialog'

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-6">
            {/* Header top section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Blog Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage, analyze, and grow your content</p>
              </div>
              <Button size="lg" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}
