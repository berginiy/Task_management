import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import type { User } from '../types';

interface AuthContextType {
    token: string | null;
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
            api.get('/api/auth/me')
                .then(res => setCurrentUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                    setCurrentUser(null);
                });
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const response = await api.post('/api/auth/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            currentUser,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}