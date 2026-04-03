import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Department, User } from '../types';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showAddUsersModal, setShowAddUsersModal] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
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

            const normalized = data.map((dept: any) => ({
                ...dept,
                id: dept.id?.toString() || dept.id
            }));

            setDepartments(normalized);
        } catch (err: any) {
            console.error("Ошибка загрузки отделов:", err);
            setError('Не удалось загрузить отделы');
            setDepartments([]);
        } finally {
            setLoading(false);
        }
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
            console.error(err);
            alert(err.response?.data?.message || 'Ошибка при создании отдела');
        }
    };

    const openAddUsersModal = async (deptId: string) => {
        setSelectedDepartmentId(deptId);
        setSelectedUsers([]);
        try {
            const res = await api.get(`/api/departments/${deptId}/available-users`);
            setAvailableUsers(Array.isArray(res.data) ? res.data : []);
            setShowAddUsersModal(true);
        } catch (err) {
            console.error(err);
            alert("Не удалось загрузить список сотрудников");
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
        if (!selectedDepartmentId || selectedUsers.length === 0) return;

        try {
            await api.post(`/api/departments/${selectedDepartmentId}/users`, selectedUsers);

            alert(`Успешно добавлено ${selectedUsers.length} сотрудников`);
            setShowAddUsersModal(false);
            setSelectedUsers([]);

            await loadDepartments(); 

        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || err.response?.data?.error || "Ошибка при добавлении сотрудников";
            alert(message);
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Отделы</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
                >
                    + Создать отдел
                </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

            {/* Форма создания */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow p-6 mb-8">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Название отдела *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3"
                            required
                        />
                        <textarea
                            placeholder="Описание"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full border rounded-xl px-4 py-3"
                        />
                        <div className="flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl">Создать</button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 px-6 py-3 rounded-xl">Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : departments.length === 0 ? (
                <p className="text-gray-500">Отделы не найдены</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <div key={dept.id} className="bg-white rounded-2xl shadow p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl">{dept.name}</h3>
                                <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700">✕</button>
                            </div>

                            {dept.description && <p className="text-gray-600 mt-2 text-sm">{dept.description}</p>}

                            <div className="mt-4 text-sm text-gray-600">
                                Сотрудников: <strong>{dept.users?.length || 0}</strong>
                            </div>

                            <button
                                onClick={() => openAddUsersModal(dept.id)}
                                className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium"
                            >
                                + Добавить сотрудников
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showAddUsersModal && selectedDepartmentId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Добавить сотрудников</h2>
                        </div>

                        <div className="p-6 overflow-auto flex-1">
                            {availableUsers.length === 0 ? (
                                <p className="text-gray-500 py-10 text-center">Нет доступных сотрудников</p>
                            ) : (
                                availableUsers.map(user => (
                                    <label key={user.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
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
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
                            >
                                Добавить ({selectedUsers.length})
                            </button>
                            <button
                                onClick={() => setShowAddUsersModal(false)}
                                className="flex-1 bg-gray-100 py-3 rounded-xl"
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