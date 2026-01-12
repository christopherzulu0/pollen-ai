"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, TrendingUp } from "lucide-react"

const mockServices = [
  {
    id: "1",
    name: "Savings Groups",
    category: "Finance",
    status: "active",
    users: 342,
    revenue: 125000,
    growth: 12.5,
  },
  {
    id: "2",
    name: "Personal Loans",
    category: "Lending",
    status: "active",
    users: 156,
    revenue: 89000,
    growth: 8.2,
  },
  {
    id: "3",
    name: "Solar Financing",
    category: "Energy",
    status: "active",
    users: 78,
    revenue: 156000,
    growth: 23.1,
  },
]

export function ServicesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Services Overview</h2>
          <p className="text-muted-foreground">Manage and monitor all platform services</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <Card key={service.id} className="bg-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{service.category}</p>
                </div>
                <Badge className="bg-success text-success-foreground">{service.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Users</span>
                </div>
                <span className="font-semibold">{service.users}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Revenue</span>
                </div>
                <span className="font-semibold">${(service.revenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Growth</span>
                <span className="text-sm font-semibold text-success">+{service.growth}%</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Manage Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
