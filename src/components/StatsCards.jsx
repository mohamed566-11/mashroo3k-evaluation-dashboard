import { memo } from 'react'
import { Users, Star, ThumbsUp, TrendingUp } from 'lucide-react'

const StatsCards = memo(({ stats }) => {
  if (!stats) {
    // Provide default stats object to prevent errors
    stats = {
      total: 0,
      averages: {
        investor_rep: 0,
        advisory_team: 0,
        output_quality: 0,
        website_exp: 0
      },
      recommendRate: 0,
      recentCount: 0
    };
  }

  const cards = [
    {
      title: 'إجمالي التقييمات',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500 dark:bg-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      change: `+${stats.recentCount} في آخر 7 أيام`,
      trend: stats.recentCount > 0 ? 'up' : 'neutral'
    },
    {
      title: 'متوسط التقييم العام',
      value: (
        Object.values(stats.averages || {}).reduce((sum, avg) => sum + (avg || 0), 0) / Math.max(Object.keys(stats.averages || {}).length, 1)
      ).toFixed(2),
      icon: Star,
      color: 'bg-yellow-500 dark:bg-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
      change: 'من 5 نجوم',
      trend: 'neutral'
    },
    {
      title: 'معدل التوصية',
      value: `${(stats.recommendRate || 0).toFixed(1)}%`,
      icon: ThumbsUp,
      color: 'bg-green-500 dark:bg-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      change: `${(((stats.recommendRate || 0) / 100) * (stats.total || 0)).toFixed(0)} عميل`,
      trend: stats.recommendRate > 70 ? 'up' : stats.recommendRate > 50 ? 'neutral' : 'down'
    },
    {
      title: 'متوسط تقييم الموقع',
      value: (stats.averages?.website_exp || 0).toFixed(2),
      icon: TrendingUp,
      color: 'bg-purple-500 dark:bg-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      change: 'من 5 نجوم',
      trend: 'neutral'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${card.bgGradient}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {card.change}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

StatsCards.displayName = 'StatsCards'

export default StatsCards

