import { StatCard } from './stat-card'
import { Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react'

export function StatsGrid() {
  const stats = [
    {
      label: 'Total Views',
      value: '12,543',
      icon: Eye,
      trend: '+2.5%',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      label: 'Total Likes',
      value: '2,847',
      icon: Heart,
      trend: '+5.1%',
      color: 'bg-rose-500/10 text-rose-500'
    },
    {
      label: 'Comments',
      value: '892',
      icon: MessageCircle,
      trend: '+1.2%',
      color: 'bg-amber-500/10 text-amber-500'
    },
    {
      label: 'Engagement Rate',
      value: '8.4%',
      icon: TrendingUp,
      trend: '+0.8%',
      color: 'bg-emerald-500/10 text-emerald-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
