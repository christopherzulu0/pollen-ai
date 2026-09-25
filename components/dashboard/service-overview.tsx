"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, PiggyBank, Users, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface ServiceOverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ServiceOverview({ className, ...props }: ServiceOverviewProps) {
  const services = [
    {
      id: 1,
      name: "Personal Loans",
      description: "Short-term loans with competitive rates",
      status: "active",
      icon: CreditCard,
      progress: 50,
      limit: "K 10,000",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Village Banking",
      description: "Group savings and loan program",
      status: "active",
      icon: Users,
      progress: 75,
      limit: "K 5,000",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Savings Account",
      description: "Interest-bearing savings account",
      status: "available",
      icon: PiggyBank,
      progress: 0,
      limit: "Unlimited",
      rating: 4.2,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
      case "available":
        return <Badge variant="outline">Available</Badge>
      default:
        return null
    }
  }

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg border border-border/50 p-3 bg-background/50"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    service.name === "Personal Loans"
                      ? "bg-blue-500/10 text-blue-500"
                      : service.name === "Village Banking"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-green-500/10 text-green-500",
                  )}
                >
                  <service.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>

                  {service.status === "active" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Utilization</span>
                        <span>{service.progress}%</span>
                      </div>
                      <Progress value={service.progress} className="h-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Limit: {service.limit}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-amber-500 mr-1" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {service.status === "available" && (
                    <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                      Activate Service
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <Button variant="outline" size="sm" className="w-full gap-1">
            Explore More Services
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

