import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Department, User } from '../types';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showUsersModal, setShowUsersModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);

    const [showAddUsersModal, setShowAddUsersModal] = useState(false);
    const [selectedDepartmentIdForAdd, setSelectedDepartmentIdForAdd] = useState<string | null>(null);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/departments');
            const data = Array.isArray(res.data) ? res.data : [];
            setDepartments(data);
        } catch (err: any) {
            console.error("Ошибка загрузки отделов:", err);
            setError('Не удалось загрузить отделы');
        } finally {
            setLoading(false);
        }
    };

    const openUsersModal = (dept: Department) => {
        setSelectedDepartment(dept);
        setDepartmentUsers(dept.users || []);   
        setShowUsersModal(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/departments', {
                name: name.trim(),
                description: description.trim() || null,
            });
            setName('');
            setDescription('');
            setShowForm(false);
            loadDepartments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка при создании отдела');
        }
    };

    const openAddUsersModal = async (deptId: string) => {
        setSelectedDepartmentIdForAdd(deptId);
        setSelectedUsers([]);
        try {
            const res = await api.get(`/api/departments/${deptId}/available-users`);
            setAvailableUsers(Array.isArray(res.data) ? res.data : []);
            setShowAddUsersModal(true);
        } catch (err) {
            alert("Не удалось загрузить список доступных сотрудников");
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAddUsers = async () => {
        if (!selectedDepartmentIdForAdd || selectedUsers.length === 0) return;

        try {
            await api.post(`/api/departments/${selectedDepartmentIdForAdd}/users`, selectedUsers);
            alert(`Успешно добавлено ${selectedUsers.length} сотрудников`);
            setShowAddUsersModal(false);
            setSelectedUsers([]);
            loadDepartments();
        } catch (err: any) {
            alert(err.response?.data?.message || "Ошибка при добавлении сотрудников");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить отдел?')) return;
        try {
            await api.delete(`/api/departments/${id}`);
            loadDepartments();
        } catch (err) {
            alert("Ошибка при удалении");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Отделы</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-medium transition-colors flex items-center gap-2"
                >
                    + Создать отдел
                </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6">{error}</div>}

            {/* Форма создания отдела */}
            {showForm && (
                <div className="bg-white rounded-3xl shadow p-8 mb-10">
                    <form onSubmit={handleCreate} className="space-y-6">
                        <input
                            type="text"
                            placeholder="Название отдела *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg"
                            required
                        />
                        <textarea
                            placeholder="Описание отдела (необязательно)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-2xl px-5 py-4"
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium">
                                Создать отдел
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-100 px-8 py-3 rounded-2xl font-medium"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p className="text-center py-12 text-gray-500 text-lg">Загрузка отделов...</p>
            ) : departments.length === 0 ? (
                <p className="text-center py-12 text-gray-500 text-lg">Отделы не найдены</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <div
                            key={dept.id}
                            onClick={() => openUsersModal(dept)}
                            className="bg-white rounded-3xl shadow hover:shadow-xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-2xl text-gray-900 mb-3">{dept.name}</h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(dept.id); }}
                                    className="text-red-400 hover:text-red-600 text-2xl leading-none"
                                >
                                    ✕
                                </button>
                            </div>

                            {dept.description && (
                                <p className="text-gray-600 line-clamp-2 mb-6">{dept.description}</p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">👥</span>
                                    <div>
                                        <p className="text-sm text-gray-500">Сотрудников</p>
                                        <p className="text-2xl font-semibold text-blue-600">
                                            <strong>{dept.userCount || 0}</strong>
                                        </p>
                                    </div>
                                </div>
                                <span className="text-blue-600 text-sm font-medium group-hover:underline">
                                    Посмотреть →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showUsersModal && selectedDepartment && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Заголовок */}
                        <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedDepartment.name}</h2>
                                <p className="text-gray-500">Список сотрудников • {departmentUsers.length} чел.</p>
                            </div>
                            <button
                                onClick={() => setShowUsersModal(false)}
                                className="text-4xl text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 overflow-auto max-h-[65vh]">
                            {departmentUsers.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    В этом отделе пока нет сотрудников
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {departmentUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl">
                                                👤
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg text-gray-900">{user.fullName}</p>
                                                <p className="text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex gap-4">
                            <button
                                onClick={() => setShowUsersModal(false)}
                                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 rounded-2xl font-medium transition-colors"
                            >
                                Закрыть
                            </button>
                            <button
                                onClick={() => {
                                    setShowUsersModal(false);
                                    openAddUsersModal(selectedDepartment.id);
                                }}
                                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-medium transition-colors"
                            >
                                + Добавить сотрудников
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddUsersModal && selectedDepartmentIdForAdd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Добавить сотрудников в отдел</h2>
                        </div>

                        <div className="p-6 overflow-auto flex-1">
                            {availableUsers.length === 0 ? (
                                <p className="text-center py-10 text-gray-500">Нет доступных сотрудников</p>
                            ) : (
                                availableUsers.map(user => (
                                    <label key={user.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <p className="font-medium">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={handleAddUsers}
                                disabled={selectedUsers.length === 0}
                                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl disabled:opacity-50 font-medium"
                            >
                                Добавить ({selectedUsers.length})
                            </button>
                            <button
                                onClick={() => setShowAddUsersModal(false)}
                                className="flex-1 bg-gray-100 py-4 rounded-2xl font-medium"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}