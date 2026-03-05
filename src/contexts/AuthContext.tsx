import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'recruiter' | null;

interface AuthContextType {
    userRole: UserRole;
    userName: string;
    isAuthenticated: boolean;
    login: (role: UserRole, name?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [userName, setUserName] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') as UserRole;
        const storedName = localStorage.getItem('userName') || '';
        if (storedRole) {
            setUserRole(storedRole);
            setUserName(storedName);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (role: UserRole, name?: string) => {
        const defaultName = role === 'student' ? 'Student' : 'Recruiter';
        const finalName = name || defaultName;

        localStorage.setItem('userRole', role || '');
        localStorage.setItem('userName', finalName);

        setUserRole(role);
        setUserName(finalName);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setUserRole(null);
        setUserName('');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ userRole, userName, isAuthenticated, login, logout }}>
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
