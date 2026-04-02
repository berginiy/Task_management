import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskFormPage from './pages/TaskFormPage';
import UsersPage from './pages/UsersPage';
import DepartmentsPage from './pages/DepartmentsPage';
import RegisterPage from './pages/RegisterPage';

function PrivateLayout() {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </PrivateRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/new" element={<TaskFormPage />} />
            <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}