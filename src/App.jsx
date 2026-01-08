import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import Dashboard from './components/Dashboard'
import { CardSkeleton, TableSkeleton, ChartSkeleton } from './components/LoadingSkeleton'
import { getEvaluations, getEvaluationsStats, getEvaluationsByDate, getReasonsDistribution } from './lib/supabase'
import toast from 'react-hot-toast'

function App() {
  const [evaluations, setEvaluations] = useState([])
  const [stats, setStats] = useState(null)
  const [dateData, setDateData] = useState([])
  const [reasonsData, setReasonsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [evaluationsData, statsData, dateDataResult, reasonsDataResult] = await Promise.all([
        getEvaluations(),
        getEvaluationsStats(),
        getEvaluationsByDate(),
        getReasonsDistribution()
      ])
      
      setEvaluations(evaluationsData)
      setStats(statsData)
      setDateData(dateDataResult)
      setReasonsData(reasonsDataResult)
      
      toast.success('تم تحميل البيانات بنجاح')
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
      toast.error('حدث خطأ أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center w-full max-w-7xl">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">جاري تحميل البيانات...</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl border border-red-200 dark:border-red-800 max-w-md shadow-lg">
            <h2 className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">حدث خطأ</h2>
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="إعادة المحاولة"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Dashboard 
        evaluations={evaluations}
        stats={stats}
        dateData={dateData}
        reasonsData={reasonsData}
        onRefresh={loadData}
      />
    </ThemeProvider>
  )
}

export default App

