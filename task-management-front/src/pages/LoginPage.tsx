import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Неверный email или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6">
                        <span className="text-5xl">📋</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white">TaskFlow</h1>
                    <p className="text-blue-300 mt-2">Войдите в свой аккаунт</p>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                placeholder="admin@taskmanager.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-70"
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-gray-400 text-sm">
                    Нет аккаунта?{' '}
                    <a href="/register" className="text-blue-400 hover:text-blue-300">Зарегистрироваться</a>
                </div>
            </div>
        </div>
    );
}