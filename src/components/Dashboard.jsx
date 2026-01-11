import { useState, memo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, Users, RefreshCw, Download, FileSpreadsheet } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import StatsCards from './StatsCards'
import RatingsChart from './RatingsChart'
import ReasonsChart from './ReasonsChart'
import RecommendationsChart from './RecommendationsChart'
import EvaluationsTable from './EvaluationsTable'
import ThemeToggle from './ThemeToggle'
import { exportToCSV } from '../utils/export'
import toast from 'react-hot-toast'

const Dashboard = memo(({ evaluations, stats, dateData, reasonsData, onRefresh, canAccessOverview, canAccessEvaluations }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isExporting, setIsExporting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { canExportCSV, getUserRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const language = 'ar'

  // Handle initial tab selection based on user permissions and current route
  useEffect(() => {
    const role = getUserRole();
    const pathname = location.pathname;

    // Set initial tab based on route and user role
    if (pathname.includes('/overview')) {
      if (role === 'OVERVIEW_VIEWER' || role === 'ADMIN') {
        setActiveTab('overview');
      } else {
        toast.error('غير مصرح لك بالوصول إلى صفحة النظرة العامة');
        if (role === 'EVALUATIONS_VIEWER') {
          navigate('/evaluations', { replace: true });
        }
      }
    } else if (pathname.includes('/evaluations')) {
      if (role === 'EVALUATIONS_VIEWER' || role === 'ADMIN') {
        setActiveTab('evaluations');
      } else {
        toast.error('غير مصرح لك بالوصول إلى صفحة التقييمات');
        if (role === 'OVERVIEW_VIEWER') {
          navigate('/overview', { replace: true });
        }
      }
    } else if (pathname.includes('/dashboard')) {
      // Default to overview for admin
      if (role === 'ADMIN') {
        setActiveTab('overview');
      } else if (role === 'EVALUATIONS_VIEWER') {
        setActiveTab('evaluations');
        navigate('/evaluations');
      } else if (role === 'OVERVIEW_VIEWER') {
        setActiveTab('overview');
        navigate('/overview');
      }
    } else {
      // Set initial tab based on user role for root path
      if (role === 'OVERVIEW_VIEWER') {
        setActiveTab('overview');
        navigate('/overview');
      } else if (role === 'EVALUATIONS_VIEWER') {
        setActiveTab('evaluations');
        navigate('/evaluations');
      } else if (role === 'ADMIN') {
        setActiveTab('overview');
        navigate('/dashboard');
      }
    }
  }, [getUserRole, location.pathname, navigate]);

  // Check if user has access to current tab
  useEffect(() => {
    const role = getUserRole();

    if (role === 'OVERVIEW_VIEWER' && activeTab === 'evaluations') {
      // Redirect to overview if trying to access evaluations as overview viewer
      setActiveTab('overview');
      navigate('/evaluations', { replace: true });
    } else if (role === 'EVALUATIONS_VIEWER' && activeTab === 'overview') {
      // Redirect to evaluations if trying to access overview as evaluations viewer
      setActiveTab('evaluations');
      navigate('/overview', { replace: true });
    }
  }, [activeTab, getUserRole, navigate]);

  // Redirect user if they don't have access to either section
  useEffect(() => {
    if (!canAccessOverview && !canAccessEvaluations) {
      toast.error('ليس لديك إذن بالوصول إلى أي قسم في النظام');
      signOut();
      navigate('/login');
    }
  }, [canAccessOverview, canAccessEvaluations, signOut, navigate]);

  const handleExportCSV = async () => {
    if (!canExportCSV()) {
      toast.error('غير مصرح لك بتصدير ملف CSV');
      return;
    }

    try {
      setIsExporting(true)
      const userRole = getUserRole();
      exportToCSV(evaluations, 'evaluations', userRole)
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
                {canExportCSV() && (
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting || evaluations.length === 0}
                    className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="تصدير CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>
                )}
              </div>
              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  try {
                    await onRefresh();
                    toast.success('تم تحديث البيانات بنجاح');
                  } catch (error) {
                    toast.error('حدث خطأ أثناء تحديث البيانات');
                  } finally {
                    setIsRefreshing(false);
                  }
                }}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label="تحديث البيانات"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'جاري التحديث...' : 'تحديث'}</span>
              </button>
              <button
                onClick={() => {
                  signOut();
                  navigate('/login');
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="تسجيل الخروج"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {canAccessOverview && (
            <button
              onClick={() => {
                if (getUserRole() === 'EVALUATIONS_VIEWER') {
                  return;
                }
                setActiveTab('overview');
                navigate('/overview');
              }}
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
          )}
          {canAccessEvaluations && (
            <button
              onClick={() => {
                if (getUserRole() === 'OVERVIEW_VIEWER') {
                  return;
                }
                setActiveTab('evaluations');
                navigate('/evaluations');
              }}
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
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && canAccessOverview && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <StatsCards stats={stats} key={`stats-cards-${JSON.stringify(stats || {})}`} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RatingsChart stats={stats} key={`ratings-chart-${JSON.stringify(stats || {})}`} />
              <ReasonsChart reasonsData={reasonsData} key={`reasons-chart-${JSON.stringify(reasonsData || [])}`} />
            </div>

            <RecommendationsChart recommendationsData={(stats?.recommendationDistribution) || []} key={`recommendations-chart-${JSON.stringify(stats?.recommendationDistribution || [])}`} />
          </div>
        )}

        {activeTab === 'evaluations' && canAccessEvaluations && (
          <div className="animate-fade-in">
            <EvaluationsTable evaluations={evaluations} key={`evaluations-table-${evaluations.length}`} />
          </div>
        )}

        {!canAccessOverview && activeTab === 'overview' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">غير مصرح بالوصول</h3>
            <p className="text-gray-500 dark:text-gray-400">لا يُسمح لك بعرض محتوى النظرة العامة</p>
          </div>
        )}

        {!canAccessEvaluations && activeTab === 'evaluations' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">غير مصرح بالوصول</h3>
            <p className="text-gray-500 dark:text-gray-400">لا يُسمح لك بعرض محتوى التقييمات</p>
          </div>
        )}
      </main>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard