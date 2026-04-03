import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/auth/register', {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                password: form.password
            });

            setSuccess('Регистрация прошла успешно! Теперь вы можете войти.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message ||
                err.response?.data?.error ||
                'Ошибка регистрации. Возможно, такой email уже существует.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white text-center">
                    <h1 className="text-4xl font-bold mb-2">Task Manager</h1>
                    <p className="text-blue-100">Создайте аккаунт</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-2xl text-sm">
                                {success}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">ФИО</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Иванов Иван Иванович"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Подтвердите пароль</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-600">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}