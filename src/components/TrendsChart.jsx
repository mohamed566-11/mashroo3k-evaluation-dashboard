import { memo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

const TrendsChart = memo(({ dateData }) => {
  if (!dateData || dateData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">اتجاهات التقييمات</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-12 text-lg">لا توجد بيانات كافية لعرض الاتجاهات</p>
      </div>
    )
  }

  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e7eb' : '#1f2937'
  const gridColor = isDark ? '#374151' : '#e5e7eb'

  // تجميع البيانات حسب التاريخ
  const groupedData = {}
  dateData.forEach(item => {
    const date = format(parseISO(item.created_at), 'yyyy-MM-dd')
    if (!groupedData[date]) {
      groupedData[date] = {
        date,
        investor_rep: [],
        advisory_team: [],
        output_quality: [],
        website_exp: []
      }
    }
    groupedData[date].investor_rep.push(item.investor_rep_rating)
    groupedData[date].advisory_team.push(item.advisory_team_rating)
    groupedData[date].output_quality.push(item.output_quality_rating)
    groupedData[date].website_exp.push(item.website_exp_rating)
  })

  const chartData = Object.values(groupedData).map(group => ({
    date: format(parseISO(group.date), 'dd/MM'),
    'ممثل المستثمر': (
      group.investor_rep.reduce((sum, r) => sum + r, 0) / group.investor_rep.length
    ).toFixed(2),
    'الفريق الاستشاري': (
      group.advisory_team.reduce((sum, r) => sum + r, 0) / group.advisory_team.length
    ).toFixed(2),
    'جودة المخرجات': (
      group.output_quality.reduce((sum, r) => sum + r, 0) / group.output_quality.length
    ).toFixed(2),
    'تجربة الموقع': (
      group.website_exp.reduce((sum, r) => sum + r, 0) / group.website_exp.length
    ).toFixed(2)
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        اتجاهات التقييمات عبر الزمن
      </h3>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData} margin={{ top: 30, right: 50, left: 50, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
          <XAxis
            dataKey="date"
            tick={{ fill: textColor, fontSize: 14, fontWeight: 500 }}
            stroke={textColor}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            domain={[0, 5]}
            tick={{ fill: textColor, fontSize: 14, fontWeight: 500 }}
            stroke={textColor}
            width={50}
          />
          <Tooltip
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
          <Line
            type="monotone"
            dataKey="ممثل المستثمر"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#3b82f6' }}
            activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="الفريق الاستشاري"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#22c55e' }}
            activeDot={{ r: 8, stroke: '#22c55e', strokeWidth: 2 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="جودة المخرجات"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#f59e0b' }}
            activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 2 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="تجربة الموقع"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#8b5cf6' }}
            activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

TrendsChart.displayName = 'TrendsChart'

export default TrendsChart

