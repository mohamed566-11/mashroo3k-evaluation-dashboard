import { memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const percentage = ((value / 5) * 100).toFixed(0)

    return (
      <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl shadow-2xl border-2 border-purple-500/30">
        <p className="text-gray-800 dark:text-gray-100 font-bold text-base mb-2">
          {payload[0].payload.name}
        </p>
        <div className="space-y-1">
          <p className="text-purple-600 dark:text-purple-400 font-bold text-2xl">
            {value.toFixed(2)} / 5
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const RatingsChart = memo(({ stats }) => {
  // Don't modify props directly, create local variable
  const localStats = stats || {
    averages: {
      investor_rep: 0,
      advisory_team: 0,
      output_quality: 0,
      website_exp: 0
    }
  };

  const isDark = document.documentElement.classList.contains('dark')

  const colors = {
    text: isDark ? '#e5e7eb' : '#374151',
    grid: isDark ? '#4b5563' : '#d1d5db',
    bg: isDark ? '#1f2937' : '#ffffff'
  }

  const data = [
    { name: 'ممثل المستثمر', value: localStats.averages?.investor_rep || 0 },
    { name: 'الفريق الاستشاري', value: localStats.averages?.advisory_team || 0 },
    { name: 'جودة المخرجات', value: localStats.averages?.output_quality || 0 },
    { name: 'تجربة الموقع', value: localStats.averages?.website_exp || 0 }
  ]

  const getColor = (v) => {
    if (v >= 4.5) return '#10b981'
    if (v >= 4) return '#22c55e'
    if (v >= 3.5) return '#f59e0b'
    if (v >= 3) return '#f97316'
    return '#ef4444'
  }

  const getGradient = (v) => {
    if (v >= 4.5) return 'from-emerald-500 to-green-600'
    if (v >= 4) return 'from-green-500 to-emerald-600'
    if (v >= 3.5) return 'from-amber-400 to-orange-500'
    if (v >= 3) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-red-600'
  }

  const getRating = (v) => {
    if (v >= 4.5) return 'ممتاز'
    if (v >= 4) return 'جيد جداً'
    if (v >= 3.5) return 'جيد'
    if (v >= 3) return 'مقبول'
    return 'ضعيف'
  }

  const totalAvg = (data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(2)
  const maxRating = Math.max(...data.map(d => d.value))
  const minRating = Math.min(...data.map(d => d.value))

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          متوسطات التقييمات
        </h3>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">المتوسط الكلي</p>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            {totalAvg} / 5
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            {getRating(parseFloat(totalAvg))}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl p-5 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">أعلى تقييم</p>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">
            {maxRating.toFixed(2)} / 5
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {data.find(d => d.value === maxRating)?.name}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">أقل تقييم</p>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
            {minRating.toFixed(2)} / 5
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            {data.find(d => d.value === minRating)?.name}
          </p>
        </div>
      </div>

      {/* التشارت */}
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 40, left: 40, bottom: 80 }}
        >
          <defs>
            {data.map((item, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={getColor(item.value)} stopOpacity={0.9} />
                <stop offset="100%" stopColor={getColor(item.value)} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="5 5"
            stroke={colors.grid}
            opacity={0.2}
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={({ x, y, payload }) => {
              const lines = payload.value.split(' ')
              return (
                <g transform={`translate(${x},${y})`}>
                  {lines.length === 1 ? (
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill={colors.text}
                      fontSize={14}
                      fontWeight="600"
                      fontFamily="Cairo, sans-serif"
                      direction="rtl"
                    >
                      {payload.value}
                    </text>
                  ) : (
                    <>
                      <text
                        x={0}
                        y={0}
                        dy={10}
                        textAnchor="middle"
                        fill={colors.text}
                        fontSize={14}
                        fontWeight="600"
                        fontFamily="Cairo, sans-serif"
                        direction="rtl"
                      >
                        {lines[0]}
                      </text>
                      <text
                        x={0}
                        y={0}
                        dy={28}
                        textAnchor="middle"
                        fill={colors.text}
                        fontSize={14}
                        fontWeight="600"
                        fontFamily="Cairo, sans-serif"
                        direction="rtl"
                      >
                        {lines[1]}
                      </text>
                    </>
                  )}
                </g>
              )
            }}
            axisLine={{ stroke: colors.grid }}
            tickLine={false}
            height={70}
            interval={0}
          />

          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: colors.text, fontSize: 13, fontWeight: '600' }}
            axisLine={{ stroke: colors.grid }}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

          <Bar
            dataKey="value"
            radius={[12, 12, 0, 0]}
            maxBarSize={80}
            animationDuration={1200}
            animationBegin={0}
          >
            {data.map((item, index) => (
              <Cell
                key={index}
                fill={`url(#gradient-${index})`}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}

            <LabelList
              dataKey="value"
              position="top"
              content={({ x, y, width, value }) => (
                <g>
                  <rect
                    x={x + width / 2 - 40}
                    y={y - 35}
                    width={80}
                    height={28}
                    rx={14}
                    fill={colors.bg}
                    stroke={getColor(value)}
                    strokeWidth={2}
                  />
                  <text
                    x={x + width / 2}
                    y={y - 15}
                    textAnchor="middle"
                    fill={getColor(value)}
                    fontSize={16}
                    fontWeight="bold"
                    fontFamily="Cairo, sans-serif"
                  >
                    {value.toFixed(2)}
                  </text>
                </g>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* مقياس الألوان */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-gray-600 dark:text-gray-400">ممتاز (4.5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">جيد جداً (4+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span className="text-gray-600 dark:text-gray-400">جيد (3.5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span className="text-gray-600 dark:text-gray-400">مقبول (3+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">ضعيف (&lt;3)</span>
          </div>
        </div>
      </div>
    </div>
  )
})

RatingsChart.displayName = 'RatingsChart'
export default RatingsChart