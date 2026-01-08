import { memo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

const ReasonsChart = memo(({ reasonsData }) => {
  if (!reasonsData || reasonsData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">توزيع أسباب الاختيار</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-12 text-lg">لا توجد بيانات</p>
      </div>
    )
  }

  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e7eb' : '#1f2937'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        توزيع أسباب اختيار الشركة
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={reasonsData}
            cx="50%"
            cy="50%"
            innerRadius={60}  /* This creates the doughnut effect */
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            animationDuration={1500}
          >
            {reasonsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [value, 'عدد العملاء']}
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              color: textColor,
              fontSize: '14px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: textColor, fontWeight: 'bold' }}
          />
          <Legend
            wrapperStyle={{
              color: textColor,
              paddingTop: '15px',
              fontSize: '14px',
              textAlign: 'center'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
})

ReasonsChart.displayName = 'ReasonsChart'

export default ReasonsChart

