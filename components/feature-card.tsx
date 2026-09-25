import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  iconBg?: string
}

export default function FeatureCard({ icon, title, description, iconBg = "bg-[#00CC66]" }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-5px] overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-[#003366] to-[#00CC66] transform origin-left transition-all duration-500 group-hover:scale-x-100"></div>
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mb-6 transform transition-transform duration-500 group-hover:scale-110 shadow-lg`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-[#003366] mb-3">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

