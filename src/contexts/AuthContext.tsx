import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
export type UserRole = 'student' | 'recruiter' | null;

interface AuthContextType {
    userRole: UserRole;
    userName: string;
    userPhoto: string | null;
    isAuthenticated: boolean;
    hasCompletedProfile: boolean;
    login: (role: UserRole, name?: string, photoUrl?: string) => Promise<void>;
    loginWithGoogle: (role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    updateUserPhoto: (photoUrl: string) => void;
    completeProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [userName, setUserName] = useState<string>('');
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean>(false);

    useEffect(() => {
        // Hydrate initial state from localStorage for UX (so it doesn't flash logged out)
        const storedRole = localStorage.getItem('userRole') as UserRole;
        const storedName = localStorage.getItem('userName') || '';
        const storedPhoto = localStorage.getItem('userPhoto');
        const storedCompleted = localStorage.getItem('hasCompletedProfile') === 'true';

        if (storedRole) {
            setUserRole(storedRole);
            setUserName(storedName);
            setUserPhoto(storedPhoto);
            setIsAuthenticated(true);
            setHasCompletedProfile(storedCompleted);
        }

        // Listen for Supabase Auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const user = session.user;
                const metadata = user.user_metadata;

                // Get the intended role from localStorage that we saved right before kicking off OAuth
                const pendingRole = localStorage.getItem('pendingAuthRole') as UserRole || 'student';

                const name = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User';
                const photo = metadata.avatar_url || metadata.picture || null;

                // Sync to our local storage system and states
                localStorage.setItem('userRole', pendingRole);
                localStorage.setItem('userName', name);
                if (photo) localStorage.setItem('userPhoto', photo);
                localStorage.removeItem('pendingAuthRole'); // clean up

                setUserRole(pendingRole);
                setUserName(name);
                setUserPhoto(photo);
                setIsAuthenticated(true);
            } else if (event === 'SIGNED_OUT') {
                // Clear local states
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userPhoto');
                localStorage.removeItem('hasCompletedProfile');
                setUserRole(null);
                setUserName('');
                setUserPhoto(null);
                setIsAuthenticated(false);
                setHasCompletedProfile(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (role: UserRole, name?: string, photoUrl?: string) => {
        const defaultName = role === 'student' ? 'Student' : 'Recruiter';
        const finalName = name || defaultName;

        localStorage.setItem('userRole', role || '');
        localStorage.setItem('userName', finalName);
        if (photoUrl) {
            localStorage.setItem('userPhoto', photoUrl);
            setUserPhoto(photoUrl);
        }

        setUserRole(role);
        setUserName(finalName);
        setIsAuthenticated(true);
    };

    const loginWithGoogle = async (role: UserRole) => {
        // Store intended role before redirecting out to Google
        localStorage.setItem('pendingAuthRole', role || 'student');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/v1/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });

        if (error) {
            console.error('Error logging in with Google', error);
            localStorage.removeItem('pendingAuthRole');
            throw error;
        }
    };

    const logout = async () => {
        // Sign out of Supabase
        await supabase.auth.signOut();

        // Supabase onAuthStateChange will handle the rest of the local cleanup, 
        // but we'll do it explicitly here for immediate UI update just in case
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhoto');
        localStorage.removeItem('hasCompletedProfile');
        setUserRole(null);
        setUserName('');
        setUserPhoto(null);
        setIsAuthenticated(false);
        setHasCompletedProfile(false);
    };

    const updateUserPhoto = (photoUrl: string) => {
        localStorage.setItem('userPhoto', photoUrl);
        setUserPhoto(photoUrl);
    };

    const completeProfile = () => {
        localStorage.setItem('hasCompletedProfile', 'true');
        setHasCompletedProfile(true);
    };

    return (
        <AuthContext.Provider value={{ userRole, userName, userPhoto, isAuthenticated, hasCompletedProfile, login, loginWithGoogle, logout, updateUserPhoto, completeProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
