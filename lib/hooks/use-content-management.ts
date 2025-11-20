import { useState, useCallback } from 'react'
import { ContentVersion, ContentApproval, ScheduledContent, SEOMetadata, BulkOperation } from '@/lib/types/content-management'

export function useContentManagement() {
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [approvals, setApprovals] = useState<ContentApproval[]>([])
  const [scheduled, setScheduled] = useState<ScheduledContent[]>([])
  const [seoMetadata, setSeoMetadata] = useState<SEOMetadata[]>([])
  const [bulkOps, setBulkOps] = useState<BulkOperation[]>([])

  const createVersion = useCallback((contentId: string, data: Partial<ContentVersion>) => {
    const newVersion: ContentVersion = {
      id: Math.random().toString(36),
      contentId,
      contentType: data.contentType || 'blog',
      title: data.title || '',
      content: data.content || '',
      changes: data.changes || 'Initial version',
      createdBy: data.createdBy || 'Admin',
      createdAt: new Date(),
    }
    setVersions(prev => [newVersion, ...prev])
    return newVersion
  }, [])

  const rollbackToVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (version) {
      const restoredVersion: ContentVersion = {
        ...version,
        id: Math.random().toString(36),
        createdAt: new Date(),
        isRestored: true,
        changes: `Restored from version: ${version.createdAt.toLocaleDateString()}`
      }
      setVersions(prev => [restoredVersion, ...prev])
      return restoredVersion
    }
  }, [versions])

  const submitForApproval = useCallback((contentId: string, data: Partial<ContentApproval>) => {
    const approval: ContentApproval = {
      id: Math.random().toString(36),
      contentId,
      contentType: data.contentType || 'blog',
      title: data.title || '',
      status: 'pending-review',
      submittedBy: data.submittedBy || 'Admin',
      submittedAt: new Date(),
    }
    setApprovals(prev => [approval, ...prev])
    return approval
  }, [])

  const approveContent = useCallback((approvalId: string, reviewedBy: string, comments?: string) => {
    setApprovals(prev => prev.map(a =>
      a.id === approvalId
        ? { ...a, status: 'approved' as const, reviewedBy, reviewedAt: new Date(), comments }
        : a
    ))
  }, [])

  const scheduleContent = useCallback((contentId: string, data: Partial<ScheduledContent>) => {
    const scheduled: ScheduledContent = {
      id: Math.random().toString(36),
      contentId,
      contentType: data.contentType || 'blog',
      title: data.title || '',
      scheduledFor: data.scheduledFor || new Date(),
      status: 'scheduled',
      createdBy: data.createdBy || 'Admin',
    }
    setScheduled(prev => [scheduled, ...prev])
    return scheduled
  }, [])

  const saveSEOMetadata = useCallback((contentId: string, data: Partial<SEOMetadata>) => {
    const metadata: SEOMetadata = {
      id: Math.random().toString(36),
      contentId,
      contentType: data.contentType || 'blog',
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      keywords: data.keywords || [],
      slug: data.slug || '',
      seoScore: data.seoScore || 0,
    }
    setSeoMetadata(prev => [metadata, ...prev])
    return metadata
  }, [])

  const performBulkOperation = useCallback((operation: Partial<BulkOperation>) => {
    const bulkOp: BulkOperation = {
      id: Math.random().toString(36),
      operationType: operation.operationType || 'publish',
      contentIds: operation.contentIds || [],
      contentType: operation.contentType || 'blog',
      status: 'processing',
      createdBy: operation.createdBy || 'Admin',
      createdAt: new Date(),
      itemsProcessed: 0,
    }
    setBulkOps(prev => [bulkOp, ...prev])
    return bulkOp
  }, [])

  return {
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
  }
}
