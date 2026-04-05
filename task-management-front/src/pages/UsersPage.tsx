import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';

const roleLabels: Record<string, string> = {
    ADMIN: 'Администратор',
    CREATOR: 'Создатель',
    EXECUTOR: 'Исполнитель',
};

const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    CREATOR: 'bg-blue-100 text-blue-700',
    EXECUTOR: 'bg-green-100 text-green-700',
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/users');
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: string) => {
        if (!confirm('Деактивировать пользователя?')) return;
        try {
            await api.delete(`/api/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch {
            alert('Ошибка при деактивации');
        }
    };

    const filtered = users.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Пользователи</h1>

            <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="text-left px-6 py-4">Имя</th>
                                <th className="text-left px-6 py-4">Email</th>
                                <th className="text-left px-6 py-4">Роль</th>
                                <th className="text-left px-6 py-4">Отдел</th>
                                <th className="text-left px-6 py-4">Статус</th>
                                <th className="text-left px-6 py-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {user.fullName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                            {roleLabels[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.departmentName || '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {user.active ? 'Активен' : 'Неактивен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeactivate(user.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Деактивировать
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Пользователи не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}