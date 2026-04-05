import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ListTodo, Users, Building2, UserPlus, LogOut } from 'lucide-react';

export default function Sidebar() {
    const { currentUser, logout, isAdmin, isCreator } = useAuth();

    const menuItems = [
        { to: '/', label: 'Дашборд', icon: LayoutDashboard },
        { to: '/tasks', label: 'Задачи', icon: ListTodo },
    ];

    if (isAdmin || isCreator) {
        menuItems.push({ to: '/departments', label: 'Отделы', icon: Building2 });
    }

    if (isAdmin) {
        menuItems.push(
            { to: '/users', label: 'Пользователи', icon: Users },
            { to: '/register', label: 'Регистрация', icon: UserPlus }
        );
    }

    return (
        <div className="w-72 min-h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800">
            <div className="p-8 flex items-center gap-4 border-b border-gray-800">
                <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-900 font-black text-3xl">T</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tighter">TaskFlow</h1>
                    <p className="text-xs text-gray-500">Управление проектами</p>
                </div>
            </div>

            <nav className="flex-1 px-6 py-8 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all ${isActive
                                    ? 'bg-white/10 text-white shadow-inner'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-10 h-10 bg-gray-700 rounded-2xl flex items-center justify-center text-xl">
                        👤
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                            {currentUser?.fullName || 'Пользователь'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {currentUser?.email || ''}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-medium">
                            {currentUser?.role || ''}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
}