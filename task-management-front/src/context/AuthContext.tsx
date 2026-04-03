import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isCreator: boolean;
    isExecutor: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/api/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error("Не удалось загрузить данные пользователя");
                    logout();
                }
            }
        };
        loadUser();
    }, [token]);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await api.post('/api/auth/login', { email, password });
        const { token: newToken } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    const isAdmin = user?.role === 'ADMIN';
    const isCreator = user?.role === 'CREATOR';
    const isExecutor = user?.role === 'EXECUTOR';

    return (
        <AuthContext.Provider value={{
            token,
            user,
            login,
            logout,
            isAuthenticated: !!token,
            isAdmin,
            isCreator,
            isExecutor,
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