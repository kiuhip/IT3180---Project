import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Users,
  Building2,
  CreditCard,
  DollarSign,
  BarChart3,
  FileText,
  LogOut,
  User,
  Settings,
  Calendar,
  CalendarCheck
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { path: '/', label: 'Tổng Quan', icon: Home },
    { path: '/households', label: 'Hộ Khẩu', icon: Building2 },
    { path: '/residents', label: 'Nhân Khẩu', icon: Users },
    { path: '/fees', label: 'Quản Lý Phí', icon: DollarSign },
    { path: '/phidonggop', label: 'Phí Đóng Góp', icon: FileText },
    { path: '/payments', label: 'Thanh Toán', icon: CreditCard },
    { path: '/tamtru', label: 'Tạm Trú', icon: Calendar },
    { path: '/tamvang', label: 'Tạm Vắng', icon: CalendarCheck },
    { path: '/statistics', label: 'Thống Kê', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary-600">Quản Lý Chung Cư</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.hoTen?.[0] || 'U'}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{user?.hoTen || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.username}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg border py-2 z-10">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  // Navigate to user settings
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
              >
                <User size={16} />
                <span className="text-sm">Thông tin cá nhân</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  // Navigate to settings
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
              >
                <Settings size={16} />
                <span className="text-sm">Cài đặt</span>
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-left"
              >
                <LogOut size={16} />
                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

