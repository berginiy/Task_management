import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/users')
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Пользователи</h1>
            </div>

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-4">ФИО</th>
                                <th className="text-left px-6 py-4">Email</th>
                                <th className="text-left px-6 py-4">Роль</th>
                                <th className="text-left px-6 py-4">Отдел</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{user.fullName}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.departmentName || '—'}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
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