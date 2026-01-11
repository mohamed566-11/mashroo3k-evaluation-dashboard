import { useState, memo } from 'react'
import { BarChart3, Users, RefreshCw, Download, FileSpreadsheet } from 'lucide-react'
import StatsCards from './StatsCards'
import RatingsChart from './RatingsChart'
import ReasonsChart from './ReasonsChart'
import RecommendationsChart from './RecommendationsChart'
import EvaluationsTable from './EvaluationsTable'
import ThemeToggle from './ThemeToggle'
import { exportToCSV } from '../utils/export'
import toast from 'react-hot-toast'

const Dashboard = memo(({ evaluations, stats, dateData, reasonsData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isExporting, setIsExporting] = useState(false)
  const language = 'ar'

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      exportToCSV(evaluations, 'evaluations')
      toast.success('تم تصدير البيانات بنجاح (CSV)')
    } catch (error) {
      toast.error('حدث خطأ أثناء التصدير')
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                لوحة تحكم تقييمات مشروعك
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                مراقبة وتحليل تقييمات العملاء
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={isExporting || evaluations.length === 0}
                  className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="تصدير CSV"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline">CSV</span>
                </button>

              </div>
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="تحديث البيانات"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">تحديث</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-all duration-200 relative ${activeTab === 'overview'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            aria-label="نظرة عامة"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نظرة عامة
            </div>
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-6 py-3 font-medium transition-all duration-200 relative ${activeTab === 'evaluations'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            aria-label="التقييمات"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              التقييمات ({evaluations.length})
            </div>
            {activeTab === 'evaluations' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RatingsChart stats={stats} />
              <ReasonsChart reasonsData={reasonsData} />
            </div>

            <RecommendationsChart recommendationsData={stats?.recommendationDistribution || []} />
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="animate-fade-in">
            <EvaluationsTable evaluations={evaluations} />
          </div>
        )}
      </main>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard

