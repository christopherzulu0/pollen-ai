import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AnalyticsSection() {
  const chartData = [
    { name: 'Mon', views: 400, likes: 240 },
    { name: 'Tue', views: 300, likes: 139 },
    { name: 'Wed', views: 200, likes: 980 },
    { name: 'Thu', views: 278, likes: 390 },
    { name: 'Fri', views: 189, likes: 480 },
    { name: 'Sat', views: 239, likes: 380 },
    { name: 'Sun', views: 349, likes: 430 }
  ]

  return (
    <Card className="lg:col-span-2 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Weekly Performance</h3>
        <p className="text-sm text-muted-foreground">Views and engagement trends</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px'
            }}
          />
          <Line type="monotone" dataKey="views" stroke="var(--color-blue-500)" strokeWidth={2} />
          <Line type="monotone" dataKey="likes" stroke="var(--color-rose-500)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
