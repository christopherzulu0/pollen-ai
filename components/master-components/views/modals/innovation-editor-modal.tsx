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

interface Innovation {
  id: number
  title: string
  description: string
  technology: string
  impact: number
  adoption: number
  maturity: "emerging" | "growing" | "mature"
  views: number
}

interface InnovationEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  innovation: Innovation | null
  technologies: string[]
  onSave: (innovation: Innovation) => void
}

export function InnovationEditorModal({
  open,
  onOpenChange,
  innovation,
  technologies,
  onSave,
}: InnovationEditorModalProps) {
  const [formData, setFormData] = useState<Innovation>(
    innovation || {
      id: 0,
      title: "",
      description: "",
      technology: "",
      impact: 0,
      adoption: 0,
      maturity: "emerging",
      views: 0,
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
            {innovation ? "Edit Innovation" : "Add New Innovation"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-foreground">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 bg-white border-border/50"
              placeholder="Enter innovation title"
            />
          </div>

          <div>
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 bg-white border-border/50 resize-none"
              placeholder="Enter innovation description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Technology</Label>
              <Select value={formData.technology} onValueChange={(value) => setFormData({ ...formData, technology: value })}>
                <SelectTrigger className="mt-1 bg-white border-border/50">
                  <SelectValue placeholder="Select technology" />
                </SelectTrigger>
                <SelectContent>
                  {technologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Maturity</Label>
              <Select value={formData.maturity} onValueChange={(value: any) => setFormData({ ...formData, maturity: value })}>
                <SelectTrigger className="mt-1 bg-white border-border/50">
                  <SelectValue placeholder="Select maturity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emerging">Emerging</SelectItem>
                  <SelectItem value="growing">Growing</SelectItem>
                  <SelectItem value="mature">Mature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label className="text-foreground">Adoption Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.adoption}
                onChange={(e) => setFormData({ ...formData, adoption: Number(e.target.value) })}
                className="mt-1 bg-white border-border/50"
              />
            </div>
          </div>

          <div>
            <Label className="text-foreground">Views</Label>
            <Input
              type="number"
              value={formData.views}
              onChange={(e) => setFormData({ ...formData, views: Number(e.target.value) })}
              className="mt-1 bg-white border-border/50"
            />
          </div>

          <DialogFooter className="pt-6 border-t border-border/50">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border/50">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#003366] to-[#003366] hover:opacity-90 text-white">
              {innovation ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
