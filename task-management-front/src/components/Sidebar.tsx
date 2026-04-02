import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
    { to: '/', label: '🏠 Дашборд' },
    { to: '/tasks', label: '📋 Задачи' },
    { to: '/users', label: '👤 Пользователи' },
    { to: '/departments', label: '🏢 Отделы' },
    { to: '/register', label: '📝 Регистрация' },
];

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">
                Task Manager
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={logout}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                    Выйти
                </button>
            </div>
        </aside>
    );
}