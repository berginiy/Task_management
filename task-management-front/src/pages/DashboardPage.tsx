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
        <div className="p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900">Добро пожаловать обратно!</h1>
                <p className="text-gray-500 mt-2 text-lg">Вот как обстоят дела с вашими задачами</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Загрузка статистики...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Всего задач" value={stats.total} color="blue" icon="📋" />
                    <StatCard title="Новые" value={stats.new} color="gray" icon="✨" />
                    <StatCard title="В работе" value={stats.inProgress} color="amber" icon="🔨" />
                    <StatCard title="Завершены" value={stats.completed} color="emerald" icon="✅" />
                    <StatCard title="Просрочены" value={stats.expired} color="red" icon="⚠️" />
                    <StatCard title="Скоро дедлайн" value={stats.nearDeadline} color="orange" icon="⏰" />
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, color, icon }: {
    title: string;
    value: number;
    color: string;
    icon: string;
}) {
    const colorClasses = {
        blue: 'from-blue-500 to-indigo-600',
        gray: 'from-gray-500 to-slate-600',
        amber: 'from-amber-500 to-yellow-600',
        emerald: 'from-emerald-500 to-teal-600',
        red: 'from-red-500 to-rose-600',
        orange: 'from-orange-500 to-amber-600',
    };

    return (
        <div className={`card bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-8 text-white`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg opacity-90">{title}</p>
                    <p className="text-6xl font-bold mt-4">{value}</p>
                </div>
                <div className="text-5xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}