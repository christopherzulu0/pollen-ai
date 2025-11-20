import { Card } from '@/components/ui/card'
import { TrendingUp, BookOpen } from 'lucide-react'

export function TrendingPosts() {
  const trendingPosts = [
    { id: 1, title: 'CSS Grid vs Flexbox', views: 3124, growth: 45 },
    { id: 2, title: 'React Patterns', views: 1843, growth: 32 },
    { id: 3, title: 'Next.js 15 Guide', views: 2543, growth: 28 }
  ]

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-foreground">Trending Posts</h3>
        </div>
        <p className="text-sm text-muted-foreground">Your top performing content</p>
      </div>
      <div className="space-y-4">
        {trendingPosts.map((post) => (
          <div key={post.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.views.toLocaleString()} views</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-xs text-emerald-500 font-medium">+{post.growth}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
