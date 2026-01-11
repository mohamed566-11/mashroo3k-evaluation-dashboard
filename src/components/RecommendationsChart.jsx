import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#ef4444'];
const GRADIENTS = [
    { id: 'yes', from: '#10b981', to: '#22c55e' },
    { id: 'no', from: '#ef4444', to: '#f87171' }
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const total = payload[0].payload.total || 100;
        const percentage = ((data.value / total) * 100).toFixed(1);

        return (
            <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-500/30">
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: data.payload.fill }}
                    />
                    <p className="text-gray-800 dark:text-gray-100 font-bold text-lg">
                        {data.name}
                    </p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {data.value}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">عميل</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-1 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {percentage}%
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-bold"
            style={{ fontSize: '18px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const RecommendationsChart = memo(({ recommendationsData }) => {
    if (!recommendationsData || recommendationsData.length === 0) {
        // Provide default data to prevent errors
        recommendationsData = [];
    }

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';

    const total = recommendationsData?.reduce((sum, item) => sum + (item?.value || 0), 0) || 0;
    const dataWithTotal = recommendationsData?.map(item => ({ ...item, total })) || [];

    const yesData = recommendationsData.find(d => d.name === 'نعم' || d.name.includes('نعم'));
    const noData = recommendationsData.find(d => d.name === 'لا' || d.name.includes('لا'));

    const yesPercentage = yesData ? ((yesData.value / total) * 100).toFixed(1) : 0;
    const noPercentage = noData ? ((noData.value / total) * 100).toFixed(1) : 0;

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    توزيع التوصيات
                </h3>
            </div>

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">إجمالي الردود</p>
                        <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                        {total}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">عميل</p>
                </div>

                {yesData && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl p-5 border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">يوصون بنا</p>
                            <span className="text-2xl">👍</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                {yesData.value}
                            </p>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                ({yesPercentage}%)
                            </span>
                        </div>
                    </div>
                )}

                {noData && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-2xl p-5 border border-red-200 dark:border-red-700">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-red-600 dark:text-red-400 font-semibold">لا يوصون</p>
                            <span className="text-2xl">👎</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                                {noData.value}
                            </p>
                            <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                                ({noPercentage}%)
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* التشارت */}
            <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                    <defs>
                        {GRADIENTS.map((gradient) => (
                            <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={gradient.from} stopOpacity={1} />
                                <stop offset="100%" stopColor={gradient.to} stopOpacity={0.8} />
                            </linearGradient>
                        ))}
                    </defs>

                    <Pie
                        data={dataWithTotal}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={150}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        animationDuration={1500}
                        animationBegin={0}
                        label={CustomLabel}
                        labelLine={false}
                    >
                        {dataWithTotal.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#${index === 0 ? 'yes' : 'no'})`}
                                className="hover:opacity-80 transition-opacity duration-200"
                                stroke={isDark ? '#1f2937' : '#ffffff'}
                                strokeWidth={3}
                            />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                        verticalAlign="bottom"
                        height={60}
                        content={({ payload }) => (
                            <div className="flex items-center justify-center gap-8 pt-6">
                                {payload.map((entry, index) => (
                                    <div
                                        key={`legend-${index}`}
                                        className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full shadow-lg"
                                            style={{ backgroundColor: COLORS[index] }}
                                        />
                                        <span className="font-semibold text-base" style={{ color: textColor }}>
                                            {entry.value}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            ({entry.payload.value})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* رسالة تحفيزية */}
            {yesData && yesPercentage > 50 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎉</span>
                        <div>
                            <p className="text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                                أداء ممتاز!
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                                {yesPercentage}% من العملاء يوصون بخدماتنا
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

RecommendationsChart.displayName = 'RecommendationsChart';

export default RecommendationsChart;