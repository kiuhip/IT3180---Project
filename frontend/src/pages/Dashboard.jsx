import { useEffect, useState } from 'react';
import api from '../services/api';
import { Building2, Users, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng Hộ Khẩu',
      value: stats?.totalHouseholds || 0,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng Nhân Khẩu',
      value: stats?.totalResidents || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Thanh Toán Tháng Này',
      value: new Intl.NumberFormat('vi-VN').format(stats?.paymentThisMonth || 0) + ' đ',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Thanh Toán Năm Này',
      value: new Intl.NumberFormat('vi-VN').format(stats?.paymentThisYear || 0) + ' đ',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
        <p className="text-gray-600 mt-2">Thống kê tổng quan về hệ thống quản lý chung cư</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Phí Chưa Thanh Toán</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium">Phí Dịch Vụ</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {stats?.unpaidFees?.dichVu || 0} hộ
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Phí Quản Lý</span>
              </div>
              <span className="text-lg font-bold text-orange-600">
                {stats?.unpaidFees?.quanLy || 0} hộ
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Phí Gửi Xe</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {stats?.unpaidFees?.guiXe || 0} hộ
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông Tin Hệ Thống</h2>
          <div className="space-y-3 text-gray-600">
            <p>Hệ thống quản lý chung cư hiện đại với đầy đủ các chức năng:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Quản lý hộ khẩu và nhân khẩu</li>
              <li>Theo dõi các loại phí</li>
              <li>Quản lý thanh toán</li>
              <li>Thống kê và báo cáo</li>
              <li>Quản lý tạm trú/tạm vắng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

