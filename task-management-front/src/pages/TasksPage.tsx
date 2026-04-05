import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { Task } from '../types';
import ExtensionRequestModal from './ExtensionRequestModal';

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
};

export default function TasksPage() {
    const { currentUser } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [myTasksOnly, setMyTasksOnly] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Модалка запроса продления дедлайна
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    const [taskForExtension, setTaskForExtension] = useState<Task | null>(null);

    const isExecutor = currentUser?.role === 'EXECUTOR';

    useEffect(() => {
        if (currentUser) {
            loadTasks();
        }
    }, [currentUser]);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/tasks');
            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Ошибка загрузки задач:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Вы действительно хотите удалить эту задачу?')) return;

        try {
            await api.delete(`/api/tasks/${id}`);
            setTasks(prev => prev.filter(t => t.id !== id));
            if (selectedTask?.id === id) {
                setSelectedTask(null);
            }
        } catch (err) {
            alert('Ошибка при удалении задачи');
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await api.patch(`/api/tasks/${id}/status`, null, {
                params: { status: 'COMPLETED' }
            });

            setTasks(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, status: 'COMPLETED' } : t
                )
            );

            if (selectedTask?.id === id) {
                setSelectedTask(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
            }
        } catch (err) {
            alert('Ошибка при изменении статуса задачи');
        }
    };

    // Умная подсветка строки
    const getRowClass = (task: Task) => {
        if (task.expired) return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500';
        if (task.nearDeadline) return 'bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500';
        return 'hover:bg-gray-50';
    };

    const getStatusDisplay = (task: Task) => {
        if (task.expired) {
            return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Просрочена</span>;
        }
        if (task.nearDeadline) {
            return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Скоро дедлайн</span>;
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabels[task.status] || task.status}
            </span>
        );
    };

    // Открытие модалки продления
    const handleRequestExtension = (task: Task) => {
        setTaskForExtension(task);
        setShowExtensionModal(true);
    };

    // После успешного запроса продления
    const handleExtensionSuccess = () => {
        setShowExtensionModal(false);
        setTaskForExtension(null);
        loadTasks(); // обновляем список задач
    };

    const filtered = tasks
        .filter(t => {
            if (isExecutor && myTasksOnly && currentUser) {
                return t.executorId === currentUser.id;
            }
            return true;
        })
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    if (!currentUser) {
        return <div className="p-8 text-center text-gray-500">Загрузка пользователя...</div>;
    }

    return (
        <div className="p-6">
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
                            className={`px-5 py-3 text-sm font-medium transition-colors ${myTasksOnly ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Мои задачи
                        </button>
                        <button
                            onClick={() => setMyTasksOnly(false)}
                            className={`px-5 py-3 text-sm font-medium transition-colors ${!myTasksOnly ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Все задачи
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <p className="text-gray-500">Загрузка задач...</p>
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
                                <tr key={task.id} className={`transition-colors ${getRowClass(task)}`}>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedTask(task)}
                                            className="font-medium text-gray-800 hover:text-blue-600 text-left"
                                        >
                                            {task.title}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusDisplay(task)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{task.departmentName || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">{task.executorName || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '—'}
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
                                                    <Link to={`/tasks/${task.id}/edit`} className="text-blue-600 hover:underline">
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

                                            {/* === КНОПКА ЗАПРОСИТЬ ПРОДЛЕНИЕ === */}
                                            {isExecutor && (task.expired || task.nearDeadline) && (
                                                <button
                                                    onClick={() => handleRequestExtension(task)}
                                                    className="text-amber-600 hover:text-amber-700 hover:underline font-medium flex items-center gap-1"
                                                >
                                                    ⏳ Запросить продление
                                                </button>
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        Задачи не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модальное окно подробной информации о задаче */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50 rounded-t-3xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
                                <p className="text-gray-500 mt-1">{selectedTask.departmentName || 'Без отдела'}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-4xl text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-8 space-y-8">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Статус</p>
                                <span className={`px-5 py-2 rounded-full text-sm font-medium ${statusColors[selectedTask.status] || 'bg-gray-100 text-gray-700'}`}>
                                    {statusLabels[selectedTask.status] || selectedTask.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-3">Описание задачи</p>
                                <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedTask.description || 'Описание отсутствует'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Отдел</p>
                                    <p className="font-medium text-lg">{selectedTask.departmentName || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Создатель</p>
                                    <p className="font-medium text-lg">{selectedTask.creatorName || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Исполнитель</p>
                                    <p className="font-medium text-lg">{selectedTask.executorName || 'Не назначен'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Дедлайн</p>
                                    <p className="font-medium text-lg">
                                        {selectedTask.deadline
                                            ? new Date(selectedTask.deadline).toLocaleString('ru-RU', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '—'}
                                    </p>
                                </div>
                            </div>

                            {selectedTask.urgently && (
                                <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-5 py-2 rounded-2xl">
                                    <span className="text-xl">⚠️</span>
                                    <span className="font-semibold">Срочная задача</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex gap-4 rounded-b-3xl">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 rounded-2xl font-medium transition-colors"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно запроса продления дедлайна */}
            {showExtensionModal && taskForExtension && (
                <ExtensionRequestModal
                    taskId={taskForExtension.id}
                    onClose={() => {
                        setShowExtensionModal(false);
                        setTaskForExtension(null);
                    }}
                    onSuccess={handleExtensionSuccess}
                />
            )}
        </div>
    );
}