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
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadFormData();
    }, [id]);

    const loadFormData = async () => {
        try {
            setLoading(true);
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
            setError('Не удалось загрузить данные');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const payload = {
                ...formData,
                deadline: formData.deadline || null,
                executorId: formData.executorId || null,
            };

            if (isEdit) {
                await api.put(`/api/tasks/${id}`, payload);
            } else {
                await api.post('/api/tasks', payload);
            }

            navigate('/tasks');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при сохранении задачи');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="text-xl text-gray-500">Загрузка формы...</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {isEdit ? 'Редактировать задачу' : 'Создать новую задачу'}
                </h1>
                <p className="text-gray-500 text-lg">
                    {isEdit ? 'Внесите изменения в задачу' : 'Заполните все необходимые поля'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-10 space-y-10">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl text-red-600">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Название задачи *</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="Например: Разработка нового дизайна сайта"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Описание задачи</label>
                    <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        placeholder="Подробно опишите задачу..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Отдел *</label>
                        <select
                            required
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        >
                            <option value="">Выберите отдел</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Создатель *</label>
                        <select
                            required
                            value={formData.creatorId}
                            onChange={(e) => setFormData({ ...formData, creatorId: e.target.value })}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        >
                            <option value="">Выберите создателя</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Исполнитель</label>
                    <select
                        value={formData.executorId}
                        onChange={(e) => setFormData({ ...formData, executorId: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    >
                        <option value="">Не назначен</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Дедлайн</label>
                        <input
                            type="datetime-local"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center pt-8">
                        <label className="flex items-center gap-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.urgently}
                                onChange={(e) => setFormData({ ...formData, urgently: e.target.checked })}
                                className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500"
                            />
                            <span className="text-lg font-medium text-gray-700">Срочная задача</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 pt-8">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 btn-primary py-4 text-lg font-semibold disabled:opacity-70"
                    >
                        {submitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать задачу'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/tasks')}
                        className="flex-1 py-4 text-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-3xl transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}