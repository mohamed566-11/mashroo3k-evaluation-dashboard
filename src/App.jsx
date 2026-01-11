import { useState, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import SignIn from './components/SignIn'
import { CardSkeleton, TableSkeleton, ChartSkeleton } from './components/LoadingSkeleton'
import { getEvaluations, getEvaluationsStats, getEvaluationsByDate, getReasonsDistribution, getOverviewStats, getOverviewByDate, getOverviewReasons } from './lib/supabase'
import toast from 'react-hot-toast'

function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
      <Route path="/evaluations" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
      <Route path="/overview" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
    </Routes>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth();

  // Show loading state while checking auth status
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">جاري التحقق من الحالة...</p>
        </div>
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth();

  // Show loading state while checking auth status
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">جاري التحقق من الحالة...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardWrapper() {
  const [evaluations, setEvaluations] = useState([])
  const [stats, setStats] = useState(null)
  const [dateData, setDateData] = useState([])
  const [reasonsData, setReasonsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false);
  const dataLoadInitiated = useRef(false);
  const { canAccessOverview, canAccessEvaluations, getUserRole, authChecked } = useAuth();

  useEffect(() => {
    if (authChecked && getUserRole() && !dataLoaded && !dataLoadInitiated.current) {
      dataLoadInitiated.current = true;
      loadData();
    }
  }, [authChecked, getUserRole, dataLoaded]);

  const loadData = async () => {
    try {
      // Only show full loading state on initial load, not on refresh
      if (!dataLoaded) {
        setLoading(true);
      }
      setError(null)

      // Role-aware data fetching
      const promises = [];

      // Only fetch evaluations if user can access them
      if (canAccessEvaluations()) {
        console.log('FETCHING EVALUATIONS FOR EVALUATIONS ACCESS'); // Debug log
        promises.push(getEvaluations());
      } else {
        console.log('NOT FETCHING EVALUATIONS - NO ACCESS'); // Debug log
        promises.push(Promise.resolve([])); // Return empty array
      }

      // Only fetch overview stats if user can access them
      if (canAccessOverview()) {
        const userRole = getUserRole();
        console.log('ROLE:', userRole); // Debug log

        if (userRole === 'OVERVIEW_VIEWER') {
          // OVERVIEW_VIEWER uses RPC functions
          console.log('FETCHING OVERVIEW DATA FOR OVERVIEW_VIEWER'); // Debug log
          promises.push(
            Promise.all([
              getOverviewStats(),
              getOverviewByDate(),
              getOverviewReasons()
            ]).then(([statsData, dateDataResult, reasonsDataResult]) => {
              console.log('RPC STATS RAW:', statsData); // Debug log
              console.log('RPC DATE RAW:', dateDataResult); // Debug log
              console.log('RPC REASONS RAW:', reasonsDataResult); // Debug log

              return {
                stats: statsData,
                dateData: dateDataResult,
                reasonsData: reasonsDataResult
              };
            })
          );
        } else {
          // ADMIN and other roles use direct table access
          console.log('FETCHING EVALUATIONS DATA FOR OTHER ROLE'); // Debug log
          promises.push(
            Promise.all([
              getEvaluationsStats(),
              getEvaluationsByDate(),
              getReasonsDistribution()
            ]).then(([statsData, dateDataResult, reasonsDataResult]) => {
              console.log('EVALUATIONS STATS RAW:', statsData); // Debug log
              return {
                stats: statsData,
                dateData: dateDataResult,
                reasonsData: reasonsDataResult
              };
            })
          );
        }
      } else {
        console.log('NO ACCESS TO OVERVIEW'); // Debug log
        promises.push(Promise.resolve({
          stats: null,
          dateData: [],
          reasonsData: []
        })); // Return empty data
      }

      console.log('ALL PROMISES RESOLVED, RESULTS:', promises.length); // Debug log
      const [evaluationsData, overviewData] = await Promise.all(promises);
      console.log('FINAL DATA SET - evaluationsData:', evaluationsData.length, 'overviewData:', overviewData); // Debug log

      setEvaluations(evaluationsData);
      setStats(overviewData.stats);
      setDateData(overviewData.dateData);
      setReasonsData(overviewData.reasonsData);

      console.log('STATES SET - stats:', overviewData.stats); // Debug log
      if (!dataLoaded) {
        toast.success('تم تحميل البيانات بنجاح')
        setDataLoaded(true);
      } else {
        // Show success toast on refresh
        toast.success('تم تحديث البيانات بنجاح');
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
      toast.error('حدث خطأ أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-7xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">جاري تحميل البيانات...</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
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
    )
  }

  return (
    <>
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
        canAccessOverview={canAccessOverview()}
        canAccessEvaluations={canAccessEvaluations()}
      />
    </>
  )
}

export default AppWrapper;