import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (email: string, password: string): Promise<void> => {
        const response = await api.post('/api/auth/login', { email, password });
        const { token: newToken } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            token,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}