import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
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
    EXPIRED: 'bg-red-200 text-red-900',
};

export default function TasksPage() {
    const { currentUser } = useAuth();
    const isExecutor = currentUser?.role === 'EXECUTOR';
    const isAdmin = currentUser?.role === 'ADMIN';
    const isCreator = currentUser?.role === 'CREATOR';

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [myTasksOnly, setMyTasksOnly] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    if (!currentUser) {
        return <p className="text-gray-500">Загрузка...</p>;
    }

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/tasks');
            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch {
            console.error('Ошибка загрузки задач');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить задачу?')) return;
        try {
            await api.delete(`/api/tasks/${id}`);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch {
            alert('Ошибка при удалении');
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await api.patch(`/api/tasks/${id}/status`, null, {
                params: { status: 'COMPLETED' }
            });
            setTasks(prev => prev.map(t =>
                t.id === id ? { ...t, status: 'COMPLETED' } : t
            ));
            if (selectedTask?.id === id) {
                setSelectedTask(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
            }
        } catch {
            alert('Ошибка при изменении статуса');
        }
    };

    const filtered = tasks
        .filter(t => {
            if (isExecutor && myTasksOnly && currentUser) {
                return t.executorId === currentUser.id;
            }
            return true;
        })
        .filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Задачи</h1>
                {!isExecutor && (
                    <Link
                        to="/tasks/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
                    >
                        + Создать задачу
                    </Link>
                )}
            </div>

            <div className="flex gap-4 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                />

                {isExecutor && (
                    <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setMyTasksOnly(true)}
                            className={`px-5 py-3 text-sm font-medium transition-colors ${myTasksOnly
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Мои задачи
                        </button>
                        <button
                            onClick={() => setMyTasksOnly(false)}
                            className={`px-5 py-3 text-sm font-medium transition-colors ${!myTasksOnly
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Все задачи
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="text-left px-6 py-4">Название</th>
                                <th className="text-left px-6 py-4">Статус</th>
                                <th className="text-left px-6 py-4">Отдел</th>
                                <th className="text-left px-6 py-4">Исполнитель</th>
                                <th className="text-left px-6 py-4">Дедлайн</th>
                                <th className="text-left px-6 py-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(task => (
                                <tr
                                    key={task.id}
                                    className={`hover:bg-gray-50 transition-colors ${task.expired ? 'bg-red-50' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {task.nearDeadline && !task.expired && (
                                                <span title="Скоро дедлайн">⚠️</span>
                                            )}
                                            {task.urgently && (
                                                <span title="Срочная">🔴</span>
                                            )}
                                            <button
                                                onClick={() => setSelectedTask(task)}
                                                className="font-medium text-gray-800 hover:text-blue-600 text-left transition-colors"
                                            >
                                                {task.title}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                                            {statusLabels[task.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {task.departmentName || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {task.executorName || '—'}
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium ${task.expired
                                        ? 'text-red-600'
                                        : task.nearDeadline
                                            ? 'text-orange-500'
                                            : 'text-gray-600'
                                        }`}>
                                        {task.deadline
                                            ? new Date(task.deadline).toLocaleDateString('ru-RU')
                                            : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 text-sm flex-wrap">
                                            {(task.status === 'IN_PROGRESS' || task.status === 'NEW') && (
                                                <button
                                                    onClick={() => handleComplete(task.id)}
                                                    className="text-green-600 hover:underline font-medium"
                                                >
                                                    ✓ Выполнить
                                                </button>
                                            )}
                                            {!isExecutor && (
                                                <>
                                                    <Link
                                                        to={`/tasks/${task.id}/edit`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Изменить
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Удалить
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => setSelectedTask(task)}
                                                className="text-gray-500 hover:underline"
                                            >
                                                Подробнее
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Задачи не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedTask.urgently && <span>🔴</span>}
                                    {selectedTask.nearDeadline && <span>⚠️</span>}
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedTask.title}
                                    </h2>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedTask.status]}`}>
                                    {statusLabels[selectedTask.status]}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {selectedTask.description && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Описание</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">
                                        {selectedTask.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Отдел</p>
                                    <p className="text-gray-800 font-medium">{selectedTask.departmentName || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Создатель</p>
                                    <p className="text-gray-800 font-medium">{selectedTask.creatorName || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Исполнитель</p>
                                    <p className="text-gray-800 font-medium">{selectedTask.executorName || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Дедлайн</p>
                                    <p className={`font-medium ${selectedTask.expired
                                        ? 'text-red-600'
                                        : selectedTask.nearDeadline
                                            ? 'text-orange-500'
                                            : 'text-gray-800'
                                        }`}>
                                        {selectedTask.deadline
                                            ? new Date(selectedTask.deadline).toLocaleString('ru-RU')
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Создана</p>
                                    <p className="text-gray-800">
                                        {new Date(selectedTask.createdAt).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Обновлена</p>
                                    <p className="text-gray-800">
                                        {new Date(selectedTask.updatedAt).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t flex-wrap">
                                {(selectedTask.status === 'IN_PROGRESS' || selectedTask.status === 'NEW') && (
                                    <button
                                        onClick={() => handleComplete(selectedTask.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
                                    >
                                        ✓ Выполнить задачу
                                    </button>
                                )}
                                {!isExecutor && (
                                    <Link
                                        to={`/tasks/${selectedTask.id}/edit`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                                        onClick={() => setSelectedTask(null)}
                                    >
                                        Редактировать
                                    </Link>
                                )}
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}