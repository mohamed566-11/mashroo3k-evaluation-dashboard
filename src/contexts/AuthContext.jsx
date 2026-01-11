import { createContext, useContext, useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(false); // Only for actual operations, not initial check
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Check initial session
        checkInitialSession();

        // Listen for auth changes - this is the SINGLE SOURCE OF TRUTH
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

            if (session) {
                // If there's a session, handleAuthChange will be called by onAuthStateChange
                // So we don't need to do anything here
            } else {
                // No session, set authChecked to true
                setAuthChecked(true);
            }
        } catch (error) {
            console.error('Error checking initial session:', error);
            setAuthChecked(true);
        }
    };

    // This is the ONLY place where profile is fetched and set
    const handleAuthChange = async (session) => {
        if (session) {
            setUser(session.user);
            // Fetch user profile - SINGLE SOURCE OF TRUTH
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
        } else {
            setUser(null);
            setProfile(null);
        }
        // authChecked is true when we have processed the auth state
        setAuthChecked(true);
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

            // DO NOT fetch profile here - onAuthStateChange will handle it
            return { success: true, data };
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
            // DO NOT set state here - onAuthStateChange will handle it
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
        // Normalize role to uppercase for comparison (handles 'admin', 'ADMIN', 'Admin', etc.)
        const normalizedRole = role?.toUpperCase();
        return normalizedRole === 'ADMIN' || normalizedRole === 'OVERVIEW_VIEWER';
    };

    const canAccessEvaluations = () => {
        const role = getUserRole();
        // Normalize role to uppercase for comparison
        const normalizedRole = role?.toUpperCase();
        return normalizedRole === 'ADMIN' || normalizedRole === 'EVALUATIONS_VIEWER';
    };

    const canExportCSV = () => {
        const role = getUserRole();
        // Normalize role to uppercase for comparison
        const normalizedRole = role?.toUpperCase();
        // Check if user has ADMIN role
        if (normalizedRole !== 'ADMIN') {
            return false;
        }
        // Exclude Customer.care@mashroo3k.com from CSV export even if they have ADMIN role
        // Use case-insensitive comparison to handle any email variations
        if (user?.email?.toLowerCase() === 'customer.care@mashroo3k.com') {
            return false;
        }
        return true;
    };

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