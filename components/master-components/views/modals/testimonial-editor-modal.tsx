"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  rating: number
  category: string
  impact: number
  engagement: number
  sentiment: "positive" | "neutral" | "negative"
}

interface TestimonialEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testimonial: Testimonial | null
  categories: string[]
  onSave: (testimonial: Testimonial) => void
}

export function TestimonialEditorModal({
  open,
  onOpenChange,
  testimonial,
  categories,
  onSave,
}: TestimonialEditorModalProps) {
  const [formData, setFormData] = useState<Testimonial>(
    testimonial || {
      id: 0,
      name: "",
      role: "",
      quote: "",
      rating: 5,
      category: "",
      impact: 0,
      engagement: 0,
      sentiment: "positive",
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-[#003366] to-[#00CC66] bg-clip-text text-transparent">
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 bg-white border-border/50"
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label className="text-foreground">Role</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 bg-white border-border/50"
                placeholder="Enter role"
              />
            </div>
          </div>

          <div>
            <Label className="text-foreground">Quote</Label>
            <Textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="mt-1 bg-white border-border/50 resize-none"
              placeholder="Enter testimonial quote"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-1 bg-white border-border/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Rating</Label>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-foreground">Impact Score</Label>
              <Input
                type="number"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: Number(e.target.value) })}
                className="mt-1 bg-white border-border/50"
              />
            </div>
            <div>
              <Label className="text-foreground">Engagement</Label>
              <Input
                type="number"
                value={formData.engagement}
                onChange={(e) => setFormData({ ...formData, engagement: Number(e.target.value) })}
                className="mt-1 bg-white border-border/50"
              />
            </div>
            <div>
              <Label className="text-foreground">Sentiment</Label>
              <Select value={formData.sentiment} onValueChange={(value: any) => setFormData({ ...formData, sentiment: value })}>
                <SelectTrigger className="mt-1 bg-white border-border/50">
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-border/50">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border/50">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#003366] to-[#003366] hover:opacity-90 text-white">
              {testimonial ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
