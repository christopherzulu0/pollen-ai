"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Star, TrendingUp, MessageSquare, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TestimonialEditorModal } from "./modals/testimonial-editor-modal"

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

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Maria Tembo",
      role: "Small Business Owner",
      quote: "Before Pollen AI, I couldn't get a loan to expand my business.",
      rating: 5,
      category: "Business Loans",
      impact: 1250,
      engagement: 342,
      sentiment: "positive",
    },
    {
      id: 2,
      name: "John Mulenga",
      role: "Farmer",
      quote: "The solar irrigation equipment has changed everything for me.",
      rating: 4,
      category: "Agriculture",
      impact: 980,
      engagement: 281,
      sentiment: "positive",
    },
    {
      id: 3,
      name: "Grace Banda",
      role: "Teacher",
      quote: "I've been able to save consistently for the first time.",
      rating: 5,
      category: "Savings",
      impact: 1520,
      engagement: 456,
      sentiment: "positive",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSentiment, setSelectedSentiment] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.quote.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
    const matchesSentiment = selectedSentiment === "all" || t.sentiment === selectedSentiment
    return matchesSearch && matchesCategory && matchesSentiment
  })

  const categories = Array.from(new Set(testimonials.map(t => t.category)))
  
  const totalEngagement = testimonials.reduce((sum, t) => sum + t.engagement, 0)
  const averageRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
  const positiveCount = testimonials.filter(t => t.sentiment === "positive").length

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id))
  }

  const handleSave = (testimonial: Testimonial) => {
    if (editingTestimonial) {
      setTestimonials(testimonials.map(t => t.id === testimonial.id ? testimonial : t))
    } else {
      setTestimonials([...testimonials, { ...testimonial, id: Date.now() }])
    }
    setIsModalOpen(false)
    setEditingTestimonial(null)
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#003366] to-[#00CC66] bg-clip-text text-transparent">Testimonials Management</h1>
        <p className="text-muted-foreground mt-1">Manage user success stories and impact metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/50 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#003366]">{averageRating}</div>
            <p className="text-xs text-muted-foreground mt-1">{testimonials.length} testimonials</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00CC66]" />
              Total Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00CC66]">{totalEngagement}</div>
            <p className="text-xs text-muted-foreground mt-1">Interactions tracked</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Positive Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{positiveCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{((positiveCount / testimonials.length) * 100).toFixed(0)}% of testimonials</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-[#003366] to-[#003366] hover:opacity-90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or quote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border/50"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 border-border/50">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
          <SelectTrigger className="w-full md:w-48 border-border/50">
            <SelectValue placeholder="Filter by sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiments</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground italic mb-4 border-l-2 border-[#00CC66] pl-3">"{testimonial.quote}"</p>
              
              <div className="grid grid-cols-3 gap-3 mb-4 py-3 bg-muted/30 rounded-lg px-3">
                <div>
                  <p className="text-xs text-muted-foreground">Impact Score</p>
                  <p className="font-semibold text-[#003366]">{testimonial.impact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="font-semibold text-[#00CC66]">{testimonial.engagement}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">{testimonial.sentiment}</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <Badge variant="outline" className="bg-[#003366]/10 text-[#003366] border-[#003366]/20">{testimonial.category}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(testimonial)} className="hover:bg-muted">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(testimonial.id)} className="hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TestimonialEditorModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        testimonial={editingTestimonial}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  )
}
