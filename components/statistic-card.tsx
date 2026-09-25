import { Card, CardContent } from "@/components/ui/card"

interface StatisticCardProps {
  value: string
  label: string
}

export default function StatisticCard({ value, label }: StatisticCardProps) {
  return (
    <Card className="border-2 border-[#003366]/10 hover:border-[#003366]/30 transition-all">
      <CardContent className="p-6 text-center">
        <p className="text-4xl font-bold text-[#003366]">{value}</p>
        <p className="text-gray-600 mt-2">{label}</p>
      </CardContent>
    </Card>
  )
}

