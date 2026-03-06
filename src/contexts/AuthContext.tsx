import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'recruiter' | null;

interface AuthContextType {
    userRole: UserRole;
    userName: string;
    userPhoto: string | null;
    isAuthenticated: boolean;
    hasCompletedProfile: boolean;
    login: (role: UserRole, name?: string, photoUrl?: string) => void;
    logout: () => void;
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
    }, []);

    const login = (role: UserRole, name?: string, photoUrl?: string) => {
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

    const logout = () => {
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
        <AuthContext.Provider value={{ userRole, userName, userPhoto, isAuthenticated, hasCompletedProfile, login, logout, updateUserPhoto, completeProfile }}>
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
