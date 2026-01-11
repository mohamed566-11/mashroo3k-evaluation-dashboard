import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn(email, password);

            if (result.success) {
                // Wait for the profile to be loaded in the context
                // Then redirect based on user role
                setTimeout(() => {
                    const role = result.profile?.role;
                    if (role) {
                        redirectToRoleBasedRoute(role);
                    } else {
                        window.location.href = '/';
                    }
                }, 100);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    const redirectToRoleBasedRoute = (role) => {
        if (typeof window !== 'undefined') {
            switch (role) {
                case 'ADMIN':
                    window.location.href = '/dashboard';
                    break;
                case 'EVALUATIONS_VIEWER':
                    window.location.href = '/evaluations';
                    break;
                case 'OVERVIEW_VIEWER':
                    window.location.href = '/overview';
                    break;
                default:
                    window.location.href = '/';
                    break;
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-green-50 dark:to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="bg-white dark:bg-green-100 rounded-2xl shadow-xl p-8 border border-green-200 dark:border-green-300 transform transition-all duration-500 hover:shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-green-800 dark:text-green-900 mb-2">
                            تسجيل الدخول
                        </h1>
                        <p className="text-green-600 dark:text-green-800">
                            أدخل بيانات حسابك للوصول إلى لوحة التحكم
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-100 border border-red-200 dark:border-red-300 rounded-lg">
                            <p className="text-red-600 dark:text-red-700 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label htmlFor="email" className="block text-sm font-medium text-green-700 dark:text-green-800 mb-2">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 bg-green-50 dark:bg-green-200 border border-green-300 dark:border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    placeholder="example@domain.com"
                                    required
                                    autoComplete="username"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label htmlFor="password" className="block text-sm font-medium text-green-700 dark:text-green-800 mb-2">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 pr-12 bg-green-50 dark:bg-green-200 border border-green-300 dark:border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-green-500 dark:text-green-600 hover:text-green-700 dark:hover:text-green-800 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 dark:focus:ring-offset-green-800"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    جاري التحميل...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    تسجيل الدخول
                                </div>
                            )}
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
};

export default SignIn;