import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, userRole } = useAuth();

    useEffect(() => {
        // Supabase auth handles parsing the hash parameters automatically
        // We just need to wait for the session to be established

        // If there's an error in the URL, handle it
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
            console.error('Auth callback error:', error, errorDescription);
            navigate(`/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
            return;
        }

        // If we're already authenticated from the context hook, redirect appropriately
        if (isAuthenticated) {
            const returnTo = localStorage.getItem('authReturnPath');
            if (returnTo) {
                localStorage.removeItem('authReturnPath');
                navigate(returnTo);
            } else if (userRole === 'recruiter') {
                navigate('/dashboard/recruiter');
            } else {
                navigate('/dashboard/student');
            }
        }
    }, [isAuthenticated, navigate, searchParams, userRole]);

    // Fallback listener in case context is slow to update
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const role = localStorage.getItem('userRole');
                const returnTo = localStorage.getItem('authReturnPath');

                if (returnTo) {
                    localStorage.removeItem('authReturnPath');
                    navigate(returnTo);
                } else if (role === 'recruiter') {
                    navigate('/dashboard/recruiter');
                } else {
                    // Default to student dashboard
                    navigate('/dashboard/student');
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-brand-500 animate-spin"></div>
                    <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Authenticating...</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center">
                    Please wait while we securely sign you in and prepare your dashboard.
                </p>
            </div>
        </div>
    );
}
