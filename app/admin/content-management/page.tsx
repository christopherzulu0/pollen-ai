'use client'

import { useState } from 'react'
import { useContentManagement } from '@/lib/hooks/use-content-management'
import { VersionHistory } from '@/components/admin/content-management/version-history'
import { ApprovalWorkflow } from '@/components/admin/content-management/approval-workflow'
import { ContentScheduler } from '@/components/admin/content-management/content-scheduler'
import { SEOManager } from '@/components/admin/content-management/seo-manager'
import { BulkOperations } from '@/components/admin/content-management/bulk-operations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings } from 'lucide-react'

const mockContentItems = [
  { id: '1', title: 'Getting Started with AI', status: 'published', type: 'blog' },
  { id: '2', title: 'Advanced Analytics', status: 'draft', type: 'blog' },
  { id: '3', title: 'Cloud Services', status: 'published', type: 'service' },
]

export default function ContentManagementPage() {
  const {
    versions,
    approvals,
    scheduled,
    seoMetadata,
    bulkOps,
    createVersion,
    rollbackToVersion,
    submitForApproval,
    approveContent,
    scheduleContent,
    saveSEOMetadata,
    performBulkOperation,
  } = useContentManagement()

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
            <Settings className="w-8 h-8 text-secondary" />
            Content Management Suite
          </h1>
          <p className="text-muted-foreground mt-2">Comprehensive tools for managing all your content</p>
        </div>
      </div>

      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-border/30">
          <TabsTrigger value="workflow">Approval</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="scheduler">Schedule</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="workflow" className="space-y-6">
            <ApprovalWorkflow
              approvals={approvals}
              onApprove={approveContent}
              onReject={(id) => console.log('Reject:', id)}
            />
          </TabsContent>

          <TabsContent value="versions" className="space-y-6">
            <VersionHistory
              versions={versions}
              onRestore={rollbackToVersion}
            />
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-6">
            <ContentScheduler
              scheduled={scheduled}
              onSchedule={scheduleContent}
              onCancel={(id) => console.log('Cancel:', id)}
            />
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <SEOManager
              seoItems={seoMetadata}
              onSave={saveSEOMetadata}
            />
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <BulkOperations
              items={mockContentItems}
              operations={bulkOps}
              onExecute={performBulkOperation}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
