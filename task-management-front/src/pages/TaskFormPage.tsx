import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import type { Department, User } from '../types';

export default function TaskFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        urgently: false,
        deadline: '',
        departmentId: '',
        creatorId: '',
        executorId: '',
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                const [deptRes, userRes] = await Promise.all([
                    api.get('/api/departments'),
                    api.get('/api/users')
                ]);

                setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
                setUsers(Array.isArray(userRes.data) ? userRes.data : []);

                if (isEdit && id) {
                    const taskRes = await api.get(`/api/tasks/${id}`);
                    const t = taskRes.data;
                    setFormData({
                        title: t.title || '',
                        description: t.description || '',
                        urgently: t.urgently || false,
                        deadline: t.deadline ? t.deadline.slice(0, 16) : '',
                        departmentId: t.departmentId || '',
                        creatorId: t.creatorId || '',
                        executorId: t.executorId || '',
                    });
                }
            } catch (err: any) {
                console.error("Ошибка загрузки данных:", err);
                setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                deadline: formData.deadline || null,
                executorId: formData.executorId || null,
            };

            if (isEdit && id) {
                await api.put(`/api/tasks/${id}`, payload);
            } else {
                await api.post('/api/tasks', payload);
            }

            navigate('/tasks');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Ошибка при сохранении задачи');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">
                {isEdit ? 'Редактировать задачу' : 'Создать задачу'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-5">
                {error && (
                    <div className="text-red-600 bg-red-50 p-4 rounded-xl">{error}</div>
                )}

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Название *</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Описание</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Отдел *</label>
                    <select
                        required
                        value={formData.departmentId}
                        onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Выберите отдел</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Создатель *</label>
                    <select
                        required
                        value={formData.creatorId}
                        onChange={e => setFormData({ ...formData, creatorId: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Выберите создателя</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.fullName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Исполнитель</label>
                    <select
                        value={formData.executorId}
                        onChange={e => setFormData({ ...formData, executorId: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Не назначен</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.fullName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Дедлайн</label>
                    <input
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="urgently"
                        checked={formData.urgently}
                        onChange={e => setFormData({ ...formData, urgently: e.target.checked })}
                        className="w-4 h-4"
                    />
                    <label htmlFor="urgently" className="font-medium text-gray-700">
                        Срочная задача 🔴
                    </label>
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/tasks')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}