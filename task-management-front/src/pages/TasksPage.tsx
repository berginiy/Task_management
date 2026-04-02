import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Task } from '../types';

const statusLabels: Record<string, string> = {
    NEW: 'Новая',
    IN_PROGRESS: 'В работе',
    PENDING_REVIEW: 'На проверке',
    EXTENSION_REQUESTED: 'Запрос продления',
    COMPLETED: 'Завершена',
    REJECTED: 'Отклонена',
    EXPIRED: 'Просрочена',
};

const statusColors: Record<string, string> = {
    NEW: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    EXTENSION_REQUESTED: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-red-200 text-red-800',
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/api/tasks')
            .then((res) => {
                setTasks(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить задачу?')) return;
        await api.delete(`/api/tasks/${id}`);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Задачи</h1>
                <Link
                    to="/tasks/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
                >
                    + Создать задачу
                </Link>
            </div>

            <input
                type="text"
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-4">Название</th>
                                <th className="text-left px-6 py-4">Статус</th>
                                <th className="text-left px-6 py-4">Отдел</th>
                                <th className="text-left px-6 py-4">Исполнитель</th>
                                <th className="text-left px-6 py-4">Дедлайн</th>
                                <th className="text-left px-6 py-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{task.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                                            {statusLabels[task.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{task.departmentName || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">{task.executorName || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4 text-sm">
                                            <Link to={`/tasks/${task.id}/edit`} className="text-blue-600 hover:underline">Изменить</Link>
                                            <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline">Удалить</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}