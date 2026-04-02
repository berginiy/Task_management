import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Task } from '../types';

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/tasks')
            .then((res) => {
                setTasks(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const stats = {
        total: tasks.length,
        new: tasks.filter(t => t.status === 'NEW').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        expired: tasks.filter(t => t.expired).length,
        nearDeadline: tasks.filter(t => t.nearDeadline).length,
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Дашборд</h1>

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard label="Всего задач" value={stats.total} color="blue" />
                    <StatCard label="Новые" value={stats.new} color="gray" />
                    <StatCard label="В работе" value={stats.inProgress} color="yellow" />
                    <StatCard label="Завершены" value={stats.completed} color="green" />
                    <StatCard label="Просрочены" value={stats.expired} color="red" />
                    <StatCard label="Скоро дедлайн" value={stats.nearDeadline} color="orange" />
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-500', gray: 'bg-gray-500', yellow: 'bg-yellow-500',
        green: 'bg-green-500', red: 'bg-red-500', orange: 'bg-orange-500',
    };

    return (
        <div className="card p-6 flex items-center gap-5">
            <div className={`${colors[color]} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
                {value}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}