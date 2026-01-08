import { useState, memo, useMemo } from 'react'
import { Star, Download, Search } from 'lucide-react'
import { format } from 'date-fns'

const EvaluationsTable = memo(({ evaluations }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  const filteredEvaluations = useMemo(() => {
    return evaluations
      .filter(evaluation => {
        const search = searchTerm.toLowerCase()
        return (
          evaluation.name?.toLowerCase().includes(search) ||
          evaluation.email?.toLowerCase().includes(search) ||
          evaluation.phone?.includes(search) ||
          evaluation.reason?.toLowerCase().includes(search)
        )
      })
      .sort((a, b) => {
        let aVal = a[sortBy]
        let bVal = b[sortBy]

        if (sortBy === 'created_at') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
  }, [evaluations, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
              }`}
          />
        ))}
        <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">({rating})</span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            aria-label="بحث في التقييمات"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                الاسم
                {sortBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الهاتف
              </th>
              <th
                onClick={() => handleSort('investor_rep_rating')}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ممثل المستثمر
                {sortBy === 'investor_rep_rating' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفريق الاستشاري
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                جودة المخرجات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تجربة الموقع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التوصية
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السبب
              </th>
              <th
                onClick={() => handleSort('created_at')}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                التاريخ
                {sortBy === 'created_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ملف
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEvaluations.length === 0 ? (
              <tr>
                <td colSpan="11" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  لا توجد تقييمات
                </td>
              </tr>
            ) : (
              filteredEvaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {evaluation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {evaluation.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {evaluation.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(evaluation.investor_rep_rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(evaluation.advisory_team_rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(evaluation.output_quality_rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(evaluation.website_exp_rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${evaluation.will_recommend
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {evaluation.will_recommend ? 'نعم' : 'لا'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="max-w-xs truncate" title={evaluation.reason}>
                      {evaluation.reason}
                      {evaluation.other_reason && ` - ${evaluation.other_reason}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(evaluation.created_at), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {evaluation.file_url ? (
                      <a
                        href={evaluation.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          عرض {filteredEvaluations.length} من {evaluations.length} تقييم
        </p>
      </div>
    </div>
  )
})

EvaluationsTable.displayName = 'EvaluationsTable'

export default EvaluationsTable

