'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface ApprovalItem {
  id: string
  title: string
  status: 'draft' | 'pending-review' | 'approved' | 'rejected' | 'published'
  submittedBy: string
  submittedAt: Date
  reviewedBy?: string
  comments?: string
}

interface ApprovalWorkflowProps {
  approvals: ApprovalItem[]
  onApprove: (id: string, comments?: string) => void
  onReject: (id: string, comments?: string) => void
}

const statusConfig = {
  'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'pending-review': { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'approved': { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  'published': { label: 'Published', color: 'bg-secondary/20 text-secondary', icon: CheckCircle },
}

export function ApprovalWorkflow({ approvals, onApprove, onReject }: ApprovalWorkflowProps) {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const handleSubmit = () => {
    if (selectedItem) {
      if (action === 'approve') {
        onApprove(selectedItem.id, comments)
      } else if (action === 'reject') {
        onReject(selectedItem.id, comments)
      }
    }
    setComments('')
    setAction(null)
    setIsOpen(false)
  }

  return (
    <>
      <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Approval Workflow</CardTitle>
              <CardDescription>Review and approve pending content</CardDescription>
            </div>
            <MessageSquare className="w-5 h-5 text-secondary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {approvals.filter(a => a.status !== 'published').length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No items pending review</p>
            ) : (
              approvals
                .filter(a => ['pending-review', 'draft', 'rejected'].includes(a.status))
                .map((item) => {
                  const config = statusConfig[item.status]
                  const Icon = config.icon

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className="w-5 h-5 text-secondary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Submitted by {item.submittedBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={config.color}>{config.label}</Badge>
                        {item.status === 'pending-review' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsOpen(true)
                            }}
                            className="border-border/50 hover:border-secondary/50"
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>{selectedItem?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add review comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-24"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setAction('reject')
                  handleSubmit()
                }}
                variant="outline"
                className="flex-1 border-destructive/50 text-destructive hover:border-destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  setAction('approve')
                  handleSubmit()
                }}
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
