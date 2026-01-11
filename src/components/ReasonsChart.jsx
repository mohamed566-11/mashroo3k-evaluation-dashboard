import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { translateReason } from '../utils/translations'

const COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f43f5e'  // rose
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-2xl border-2 border-indigo-500/30">
        <p className="text-gray-800 dark:text-gray-100 font-bold text-base mb-1">
          {translateReason(payload[0].payload.name, 'ar')}
        </p>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
          {payload[0].value} عميل
        </p>
      </div>
    )
  }
  return null
}

const ReasonsChart = memo(({ reasonsData }) => {
  // Don't modify props directly, create local variable
  const localReasonsData = reasonsData || [];

  const isDark = document.documentElement.classList.contains('dark')
  const colors = {
    text: isDark ? '#e5e7eb' : '#374151',
    grid: isDark ? '#4b5563' : '#d1d5db',
    bg: isDark ? '#1f2937' : '#ffffff'
  }

  const sortedData = localReasonsData && localReasonsData.length > 0 ? [...localReasonsData].sort((a, b) => (b?.value || 0) - (a?.value || 0)) : []
  const maxValue = sortedData && sortedData.length > 0 ? Math.max(...sortedData.map(d => d?.value || 0)) : 0
  const chartHeight = Math.max(500, sortedData.length * 85)

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          توزيع أسباب اختيار الشركة
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-700">
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">إجمالي الردود</p>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {(sortedData || []).reduce((sum, d) => sum + (d?.value || 0), 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">عدد الأسباب</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {sortedData?.length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 rounded-2xl p-4 border border-pink-200 dark:border-pink-700">
          <p className="text-sm text-pink-600 dark:text-pink-400 mb-1">الأكثر شيوعاً</p>
          <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
            {(sortedData[0]?.value || 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700">
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">متوسط</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {sortedData && sortedData.length > 0 ? Math.round((sortedData.reduce((sum, d) => sum + (d?.value || 0), 0) || 0) / sortedData.length) || 0 : 0}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 20, right: 60, left: 10, bottom: 20 }}
        >
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="5 5"
            stroke={colors.grid}
            opacity={0.2}
            horizontal={true}
            vertical={false}
          />

          <XAxis
            type="number"
            stroke={colors.text}
            style={{ fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: '600' }}
            tick={{ fill: colors.text }}
            domain={[0, maxValue + 2]}
          />

          <YAxis
            type="category"
            dataKey="name"
            tickFormatter={(value) => translateReason(value, 'ar')}
            stroke="transparent"
            width={200}
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={5}
                  textAnchor="start"
                  fill={colors.text}
                  fontSize={14}
                  fontWeight="600"
                  fontFamily="Cairo, sans-serif"
                >
                  {translateReason(payload.value, 'ar')}
                </text>
              </g>
            )}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

          <Bar
            dataKey="value"
            radius={[0, 12, 12, 0]}
            maxBarSize={50}
            animationDuration={1000}
            animationBegin={0}
            label={({ name, value }) => `${translateReason(name, 'ar')}: ${value}`}
          >
            {sortedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient-${index % COLORS.length})`}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}

            <LabelList
              dataKey="value"
              position="right"
              style={{
                fill: colors.text,
                fontSize: 15,
                fontWeight: 'bold',
                fontFamily: 'Cairo, sans-serif'
              }}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

ReasonsChart.displayName = 'ReasonsChart'

export default ReasonsChart