'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Zap, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ContentItem {
  id: string
  title: string
  status: string
  type: string
}

interface BulkOperation {
  id: string
  operationType: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  itemsProcessed: number
  contentIds: string[]
}

interface BulkOperationsProps {
  items: ContentItem[]
  operations: BulkOperation[]
  onExecute: (operationType: string, contentIds: string[]) => void
}

export function BulkOperations({ items, operations, onExecute }: BulkOperationsProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [operationType, setOperationType] = useState<string>('')

  const handleSelectAll = () => {
    if (selected.length === items.length) {
      setSelected([])
    } else {
      setSelected(items.map(i => i.id))
    }
  }

  const handleToggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleExecute = () => {
    if (selected.length > 0 && operationType) {
      onExecute(operationType, selected)
      setSelected([])
      setOperationType('')
      setIsOpen(false)
    }
  }

  const recentOps = operations.slice(0, 5)

  return (
    <>
      <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Bulk Operations</CardTitle>
              <CardDescription>Perform actions on multiple items at once</CardDescription>
            </div>
            <Zap className="w-5 h-5 text-secondary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Selection Section */}
            <div className="border border-border/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Checkbox
                    checked={selected.length === items.length && items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  Select Items
                </label>
                {selected.length > 0 && (
                  <Badge className="bg-secondary/20 text-secondary">{selected.length} selected</Badge>
                )}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items available</p>
                ) : (
                  items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={() => handleToggle(item.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{item.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">{item.status}</Badge>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => setIsOpen(true)}
              disabled={selected.length === 0}
              className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Execute Operation
            </Button>

            {/* Recent Operations */}
            {recentOps.length > 0 && (
              <div className="border-t border-border/30 pt-4">
                <p className="text-sm font-medium text-foreground mb-3">Recent Operations</p>
                <div className="space-y-2">
                  {recentOps.map((op) => (
                    <div key={op.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                      <div className="text-sm">
                        <p className="font-medium text-foreground capitalize">{op.operationType}</p>
                        <p className="text-xs text-muted-foreground">{op.itemsProcessed} items</p>
                      </div>
                      {op.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Badge className="text-xs">{op.status}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Execute Bulk Operation</DialogTitle>
            <DialogDescription>
              Apply action to {selected.length} selected items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Operation Type</label>
              <Select value={operationType} onValueChange={setOperationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="publish">Publish</SelectItem>
                  <SelectItem value="unpublish">Unpublish</SelectItem>
                  <SelectItem value="archive">Archive</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleExecute}
              disabled={!operationType}
              className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
