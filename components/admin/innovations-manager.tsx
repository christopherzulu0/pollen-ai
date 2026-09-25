"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, TrendingUp, Zap, BarChart3 } from 'lucide-react'
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
import { InnovationEditorModal } from "./modals/innovation-editor-modal"

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

export function InnovationsManager() {
  const [innovations, setInnovations] = useState<Innovation[]>([
    {
      id: 1,
      title: "AI Credit Scoring",
      description: "Neural networks analyzing alternative data",
      technology: "Machine Learning",
      impact: 1850,
      adoption: 67,
      maturity: "mature",
      views: 2450,
    },
    {
      id: 2,
      title: "Blockchain Ledger",
      description: "Secure, transparent transaction recording",
      technology: "Blockchain",
      impact: 1420,
      adoption: 45,
      maturity: "growing",
      views: 1820,
    },
    {
      id: 3,
      title: "Climate Finance Platform",
      description: "Carbon credit tokenization and marketplace",
      technology: "Green Tech",
      impact: 1690,
      adoption: 52,
      maturity: "emerging",
      views: 1520,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTechnology, setSelectedTechnology] = useState("all")
  const [selectedMaturity, setSelectedMaturity] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInnovation, setEditingInnovation] = useState<Innovation | null>(null)

  const filteredInnovations = innovations.filter((innovation) => {
    const matchesSearch = innovation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         innovation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTechnology = selectedTechnology === "all" || innovation.technology === selectedTechnology
    const matchesMaturity = selectedMaturity === "all" || innovation.maturity === selectedMaturity
    return matchesSearch && matchesTechnology && matchesMaturity
  })

  const technologies = Array.from(new Set(innovations.map(i => i.technology)))
  
  const totalImpact = innovations.reduce((sum, i) => sum + i.impact, 0)
  const averageAdoption = (innovations.reduce((sum, i) => sum + i.adoption, 0) / innovations.length).toFixed(1)
  const totalViews = innovations.reduce((sum, i) => sum + i.views, 0)

  const handleEdit = (innovation: Innovation) => {
    setEditingInnovation(innovation)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setInnovations(innovations.filter(i => i.id !== id))
  }

  const handleSave = (innovation: Innovation) => {
    if (editingInnovation) {
      setInnovations(innovations.map(i => i.id === innovation.id ? innovation : i))
    } else {
      setInnovations([...innovations, { ...innovation, id: Date.now() }])
    }
    setIsModalOpen(false)
    setEditingInnovation(null)
  }

  const getMatureityColor = (maturity: string) => {
    switch(maturity) {
      case "emerging": return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "growing": return "bg-purple-500/10 text-purple-700 border-purple-200"
      case "mature": return "bg-green-500/10 text-green-700 border-green-200"
      default: return ""
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#003366] to-[#00CC66] bg-clip-text text-transparent">Innovations Management</h1>
        <p className="text-muted-foreground mt-1">Manage technology innovations and track adoption metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/50 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#003366]" />
              Total Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#003366]">{totalImpact}</div>
            <p className="text-xs text-muted-foreground mt-1">{innovations.length} innovations</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00CC66]" />
              Avg Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00CC66]">{averageAdoption}%</div>
            <p className="text-xs text-muted-foreground mt-1">Market adoption rate</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">Community engagement</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button onClick={() => { setEditingInnovation(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-[#003366] to-[#003366] hover:opacity-90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Innovation
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search innovations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border/50"
          />
        </div>
        <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
          <SelectTrigger className="w-full md:w-48 border-border/50">
            <SelectValue placeholder="Filter by technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies.map(tech => (
              <SelectItem key={tech} value={tech}>{tech}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMaturity} onValueChange={setSelectedMaturity}>
          <SelectTrigger className="w-full md:w-48 border-border/50">
            <SelectValue placeholder="Filter by maturity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="emerging">Emerging</SelectItem>
            <SelectItem value="growing">Growing</SelectItem>
            <SelectItem value="mature">Mature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInnovations.map((innovation) => (
          <Card key={innovation.id} className="border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{innovation.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{innovation.description}</p>
                </div>
                <Badge className={`ml-2 ${getMatureityColor(innovation.maturity)}`}>
                  {innovation.maturity}
                </Badge>
              </div>

              <div className="space-y-3 py-3 bg-muted/30 rounded-lg px-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Adoption Rate</span>
                    <span className="text-sm font-semibold text-[#00CC66]">{innovation.adoption}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#003366] to-[#00CC66]" style={{ width: `${innovation.adoption}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Impact Score</p>
                    <p className="font-semibold text-[#003366]">{innovation.impact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Views</p>
                    <p className="font-semibold text-[#00CC66]">{innovation.views}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <Badge variant="outline" className="bg-[#003366]/10 text-[#003366] border-[#003366]/20">{innovation.technology}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(innovation)} className="hover:bg-muted">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(innovation.id)} className="hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InnovationEditorModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        innovation={editingInnovation}
        technologies={technologies}
        onSave={handleSave}
      />
    </div>
  )
}
