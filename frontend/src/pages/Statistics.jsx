import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Statistics() {
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
    return <div className="p-8">Đang tải...</div>;
  }

  const unpaidData = [
    { name: 'Phí Dịch Vụ', value: stats?.unpaidFees?.dichVu || 0 },
    { name: 'Phí Quản Lý', value: stats?.unpaidFees?.quanLy || 0 },
    { name: 'Phí Gửi Xe', value: stats?.unpaidFees?.guiXe || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Thống Kê</h1>
        <p className="text-gray-600 mt-2">Báo cáo và phân tích dữ liệu hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Tổng Hộ Khẩu</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalHouseholds || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Tổng Nhân Khẩu</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalResidents || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Thanh Toán Tháng Này</p>
          <p className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('vi-VN').format(stats?.paymentThisMonth || 0)} đ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Thanh Toán Năm Này</p>
          <p className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('vi-VN').format(stats?.paymentThisYear || 0)} đ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Phí Chưa Thanh Toán</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={unpaidData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {unpaidData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Phí Chưa Thanh Toán (Biểu Đồ Cột)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unpaidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

