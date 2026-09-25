'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, AlertCircle, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SEOItem {
  id: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  slug: string
  seoScore: number
}

interface SEOManagerProps {
  seoItems: SEOItem[]
  onSave: (id: string, data: Partial<SEOItem>) => void
}

export function SEOManager({ seoItems, onSave }: SEOManagerProps) {
  const [selectedItem, setSelectedItem] = useState<SEOItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<SEOItem>>({})

  const handleEdit = (item: SEOItem) => {
    setSelectedItem(item)
    setFormData(item)
    setIsOpen(true)
  }

  const handleSave = () => {
    if (selectedItem) {
      onSave(selectedItem.id, formData)
      setIsOpen(false)
    }
  }

  const getSEOScoreBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800', label: 'Excellent' }
    if (score >= 60) return { color: 'bg-blue-100 text-blue-800', label: 'Good' }
    if (score >= 40) return { color: 'bg-yellow-100 text-yellow-800', label: 'Fair' }
    return { color: 'bg-red-100 text-red-800', label: 'Needs Work' }
  }

  return (
    <>
      <Card className="border-border/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">SEO Management</CardTitle>
              <CardDescription>Optimize content for search engines</CardDescription>
            </div>
            <Search className="w-5 h-5 text-secondary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {seoItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No SEO data yet</p>
            ) : (
              seoItems.map((item) => {
                const scoreBadge = getSEOScoreBadge(item.seoScore)
                const isOptimized = item.seoScore >= 60

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {isOptimized ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.metaDescription.substring(0, 60)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={scoreBadge.color}>{item.seoScore} - {scoreBadge.label}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="border-border/50 hover:border-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit SEO Metadata</DialogTitle>
            <DialogDescription>{selectedItem?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="text-sm font-medium text-foreground">Meta Title</label>
              <Input
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO title (50-60 characters)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.metaTitle?.length || 0}/60</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Meta Description</label>
              <Textarea
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO description (150-160 characters)"
                className="mt-1 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.metaDescription?.length || 0}/160</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Keywords (comma separated)</label>
              <Input
                value={formData.keywords?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(',').map(k => k.trim()) })}
                placeholder="keyword1, keyword2, keyword3"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">URL Slug</label>
              <Input
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-slug"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Save SEO Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
