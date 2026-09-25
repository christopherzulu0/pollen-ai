'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, RotateCcw, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Version {
  id: string
  title: string
  createdBy: string
  createdAt: Date
  changes: string
  isRestored?: boolean
}

interface VersionHistoryProps {
  versions: Version[]
  onRestore: (versionId: string) => void
}

export function VersionHistory({ versions, onRestore }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Version History</CardTitle>
              <CardDescription>Track and restore previous content versions</CardDescription>
            </div>
            <Clock className="w-5 h-5 text-secondary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {versions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No versions yet</p>
            ) : (
              versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{version.changes}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {version.createdBy} • {version.createdAt.toLocaleDateString()} {version.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {version.isRestored && (
                      <Badge className="mt-2 bg-secondary/20 text-secondary border-secondary/30">
                        Restored
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVersion(version)
                        setIsOpen(true)
                      }}
                      className="border-border/50 hover:border-secondary/50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestore(version.id)}
                      className="border-border/50 hover:border-secondary/50 hover:text-secondary"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Version Details</DialogTitle>
            <DialogDescription>View the content from this version</DialogDescription>
          </DialogHeader>
          {selectedVersion && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Changes</p>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{selectedVersion.changes}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Created By</p>
                  <p className="text-muted-foreground">{selectedVersion.createdBy}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground">{selectedVersion.createdAt.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
