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
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/auth/register', {
                fullName: form.fullName,
                email: form.email,
                password: form.password
            });

            alert('Регистрация успешна! Теперь вы можете войти.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8">Регистрация</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
                </p>
            </div>
        </div>
    );
}