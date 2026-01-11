import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Check initial session
        checkInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                handleAuthChange(session);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkInitialSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // No session found on initial load, redirect to login
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    navigate('/login');
                }
            }
            await handleAuthChange(session);
        } catch (error) {
            console.error('Error checking initial session:', error);
        } finally {
            setLoading(false);
            setAuthChecked(true);
        }
    };

    const handleAuthChange = async (session) => {
        if (session) {
            setUser(session.user);
            // Fetch user profile
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
        } else {
            setUser(null);
            setProfile(null);
            // Redirect to login when no session exists
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                navigate('/login');
            }
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    };

    const signIn = async (email, password) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            const { user: userData } = data;
            setUser(userData);

            // Fetch user profile
            const profileData = await fetchUserProfile(userData.id);
            setProfile(profileData);

            return { success: true, data, profile: profileData };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
            }
            setUser(null);
            setProfile(null);
            // Redirect to login after sign out
            if (typeof window !== 'undefined') {
                navigate('/login');
            }
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return !!user && !!profile;
    };

    const getUserRole = () => {
        return profile?.role;
    };

    const canAccessOverview = () => {
        const role = getUserRole();
        return role === 'ADMIN' || role === 'OVERVIEW_VIEWER';
    };

    const canAccessEvaluations = () => {
        const role = getUserRole();
        return role === 'ADMIN' || role === 'EVALUATIONS_VIEWER';
    };

    const canExportCSV = () => {
        return getUserRole() === 'ADMIN';
    };

    // Check authentication status on component mount
    useEffect(() => {
        if (authChecked && !isAuthenticated() && typeof window !== 'undefined' && window.location.pathname !== '/login') {
            navigate('/login');
        }
    }, [authChecked, user, profile, navigate]);

    const value = {
        user,
        profile,
        loading,
        authChecked,
        signIn,
        signOut,
        getUserRole,
        isAuthenticated,
        canAccessOverview,
        canAccessEvaluations,
        canExportCSV,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};