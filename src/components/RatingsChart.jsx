import { memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts'

const RatingsChart = memo(({ stats }) => {
  if (!stats) return null

  const isDark = document.documentElement.classList.contains('dark')

  const colors = {
    text: isDark ? '#e5e7eb' : '#1f2937',
    grid: isDark ? '#374151' : '#e5e7eb',
    bg: isDark ? '#1f2937' : '#ffffff'
  }

  const data = [
    { name: 'ممثل المستثمر', value: stats.averages.investor_rep },
    { name: 'الفريق الاستشاري', value: stats.averages.advisory_team },
    { name: 'جودة المخرجات', value: stats.averages.output_quality },
    { name: 'تجربة الموقع', value: stats.averages.website_exp }
  ]

  const getColor = (v) => {
    if (v >= 4.5) return '#22c55e'
    if (v >= 4) return '#4ade80'
    if (v >= 3.5) return '#fbbf24'
    if (v >= 3) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
        متوسطات التقييمات
      </h3>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 90 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />

          {/* X Axis فقط (الأسماء) */}
          <XAxis
            dataKey="name"
            tick={{ fill: colors.text, fontSize: 14, fontWeight: 600 }}
            axisLine={{ stroke: colors.text }}
            tickLine={false}
          />

          <Tooltip
            formatter={(v) => [`${v.toFixed(2)} / 5`, 'التقييم']}
            contentStyle={{
              backgroundColor: colors.bg,
              borderRadius: 10,
              border: `1px solid ${colors.grid}`,
              color: colors.text,
              fontSize: 14
            }}
            cursor={{ fill: isDark ? '#37415155' : '#e5e7eb55' }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            barSize={55}
            animationDuration={900}
          >
            {data.map((item, index) => (
              <Cell key={index} fill={getColor(item.value)} />
            ))}

            {/* القيم تظهر بوضوح فوق الأعمدة */}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => `${v.toFixed(2)} / 5`}
              style={{
                fill: colors.text,
                fontSize: 14,
                fontWeight: 700
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

RatingsChart.displayName = 'RatingsChart'
export default RatingsChart
