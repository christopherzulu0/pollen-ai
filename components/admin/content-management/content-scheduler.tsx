'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface ScheduledItem {
  id: string
  title: string
  contentType: string
  scheduledFor: Date
  status: 'scheduled' | 'published' | 'cancelled'
  createdBy: string
}

interface ContentSchedulerProps {
  scheduled: ScheduledItem[]
  onSchedule: (title: string, scheduledFor: Date) => void
  onCancel: (id: string) => void
}

export function ContentScheduler({ scheduled, onSchedule, onCancel }: ContentSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const handleSchedule = () => {
    if (title && scheduledDate && scheduledTime) {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`)
      onSchedule(title, dateTime)
      setTitle('')
      setScheduledDate('')
      setScheduledTime('')
      setIsOpen(false)
    }
  }

  const upcomingScheduled = scheduled.filter(s => s.status === 'scheduled').sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())

  return (
    <>
      <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Content Scheduler</CardTitle>
              <CardDescription>Schedule content for automatic publishing</CardDescription>
            </div>
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full mb-4 bg-secondary hover:bg-secondary/90"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>

          <div className="space-y-3">
            {upcomingScheduled.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No scheduled content</p>
            ) : (
              upcomingScheduled.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {item.scheduledFor.toLocaleDateString()} at {item.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCancel(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Schedule Content</DialogTitle>
            <DialogDescription>Choose when to publish your content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Content Title</label>
              <Input
                placeholder="Select content to schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Time</label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleSchedule}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
