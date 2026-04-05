import { useState } from 'react';
import api from '../api/axios';

interface Props {
    taskId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ExtensionRequestModal({ taskId, onClose, onSuccess }: Props) {
    const [newDeadline, setNewDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeadline) return;

        setLoading(true);
        setError('');

        try {
            await api.post(`/api/tasks/${taskId}/extension/request?newDeadline=${newDeadline}`);
            alert('Запрос на продление успешно отправлен!');
            onSuccess();
            onClose();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Не удалось отправить запрос';
            setError(message);

            if (message.includes("COMPLETED") || message.includes("недопустим")) {
                setError("Нельзя запросить продление для уже завершённой задачи");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Запросить продление дедлайна</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="text-red-600 text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Новый дедлайн
                        </label>
                        <input
                            type="datetime-local"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-medium"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !newDeadline}
                            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-medium disabled:opacity-50"
                        >
                            {loading ? 'Отправка...' : 'Отправить запрос'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}