import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, DollarSign } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    maHoKhau: '',
    soTienThanhToan: '',
  });

  useEffect(() => {
    fetchPayments();
    fetchHouseholds();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/thanhtoan');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseholds = async () => {
    try {
      const response = await api.get('/hokhau');
      setHouseholds(response.data);
    } catch (error) {
      console.error('Error fetching households:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/thanhtoan', {
        ...formData,
        soTienThanhToan: parseFloat(formData.soTienThanhToan),
      });
      fetchPayments();
      setShowModal(false);
      setFormData({ maHoKhau: '', soTienThanhToan: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  const totalAmount = payments.reduce((sum, p) => sum + (p.SoTienThanhToan || 0), 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Thanh Toán</h1>
          <p className="text-gray-600 mt-2">Theo dõi các giao dịch thanh toán</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm Thanh Toán
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tổng Số Giao Dịch</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tổng Tiền</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN').format(totalAmount)} đ
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Trung Bình/Giao Dịch</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.length > 0
                  ? new Intl.NumberFormat('vi-VN').format(totalAmount / payments.length)
                  : 0}{' '}
                đ
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Mã Hộ Khẩu</th>
              <th className="text-left p-3">Số Tiền</th>
              <th className="text-left p-3">Ngày Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{payment.MaHoKhau}</td>
                <td className="p-3">
                  {new Intl.NumberFormat('vi-VN').format(payment.SoTienThanhToan)} đ
                </td>
                <td className="p-3">
                  {new Date(payment.NgayThanhToan).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Thêm Thanh Toán</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mã Hộ Khẩu</label>
                <select
                  value={formData.maHoKhau}
                  onChange={(e) => setFormData({ ...formData, maHoKhau: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Chọn hộ khẩu</option>
                  {households.map((h) => (
                    <option key={h.MaHoKhau} value={h.MaHoKhau}>
                      {h.MaHoKhau} - {h.DiaChi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số Tiền (đồng)</label>
                <input
                  type="number"
                  value={formData.soTienThanhToan}
                  onChange={(e) => setFormData({ ...formData, soTienThanhToan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                  min="0"
                  step="1000"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ maHoKhau: '', soTienThanhToan: '' });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

