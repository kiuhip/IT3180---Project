import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function Households() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    maHoKhau: '',
    diaChi: '',
    ngayLap: '',
    ngayChuyenDi: '',
    lyDoChuyen: 'Không',
    dienTichHo: 0,
    soXeMay: 0,
    soOTo: 0,
    soXeDap: 0,
  });

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      const response = await api.get('/hokhau');
      setHouseholds(response.data);
    } catch (error) {
      console.error('Error fetching households:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/hokhau/${editing}`, { ...formData, nam: new Date().getFullYear() });
      } else {
        await api.post('/hokhau', formData);
      }
      fetchHouseholds();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (maHoKhau) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) return;
    try {
      await api.delete(`/hokhau/${maHoKhau}`);
      fetchHouseholds();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (household) => {
    setEditing(household.MaHoKhau);
    setFormData({
      maHoKhau: household.MaHoKhau,
      diaChi: household.DiaChi,
      ngayLap: household.NgayLap?.split('T')[0] || '',
      ngayChuyenDi: household.NgayChuyenDi?.split('T')[0] || '',
      lyDoChuyen: household.LyDoChuyen || 'Không',
      dienTichHo: household.dienTichHo || 0,
      soXeMay: household.SoXeMay || 0,
      soOTo: household.SoOTo || 0,
      soXeDap: household.SoXeDap || 0,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      maHoKhau: '',
      diaChi: '',
      ngayLap: '',
      ngayChuyenDi: '',
      lyDoChuyen: 'Không',
      dienTichHo: 0,
      soXeMay: 0,
      soOTo: 0,
      soXeDap: 0,
    });
    setEditing(null);
  };

  const filteredHouseholds = households.filter(
    (h) =>
      h.MaHoKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.DiaChi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Hộ Khẩu</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin các hộ khẩu trong chung cư</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm Hộ Khẩu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hộ khẩu hoặc địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Mã Hộ Khẩu</th>
                <th className="text-left p-3">Địa Chỉ</th>
                <th className="text-left p-3">Diện Tích</th>
                <th className="text-left p-3">Xe Máy</th>
                <th className="text-left p-3">Ô Tô</th>
                <th className="text-left p-3">Xe Đạp</th>
                <th className="text-left p-3">Ngày Lập</th>
                <th className="text-left p-3">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredHouseholds.map((household) => (
                <tr key={household.MaHoKhau} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{household.MaHoKhau}</td>
                  <td className="p-3">{household.DiaChi}</td>
                  <td className="p-3">{household.dienTichHo} m²</td>
                  <td className="p-3">{household.SoXeMay}</td>
                  <td className="p-3">{household.SoOTo}</td>
                  <td className="p-3">{household.SoXeDap}</td>
                  <td className="p-3">
                    {new Date(household.NgayLap).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(household)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(household.MaHoKhau)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Chỉnh Sửa Hộ Khẩu' : 'Thêm Hộ Khẩu Mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã Hộ Khẩu</label>
                  <input
                    type="text"
                    value={formData.maHoKhau}
                    onChange={(e) => setFormData({ ...formData, maHoKhau: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    disabled={!!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Địa Chỉ</label>
                  <input
                    type="text"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diện Tích (m²)</label>
                  <input
                    type="number"
                    value={formData.dienTichHo}
                    onChange={(e) => setFormData({ ...formData, dienTichHo: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày Lập</label>
                  <input
                    type="date"
                    value={formData.ngayLap}
                    onChange={(e) => setFormData({ ...formData, ngayLap: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số Xe Máy</label>
                  <input
                    type="number"
                    value={formData.soXeMay}
                    onChange={(e) => setFormData({ ...formData, soXeMay: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số Ô Tô</label>
                  <input
                    type="number"
                    value={formData.soOTo}
                    onChange={(e) => setFormData({ ...formData, soOTo: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số Xe Đạp</label>
                  <input
                    type="number"
                    value={formData.soXeDap}
                    onChange={(e) => setFormData({ ...formData, soXeDap: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lý Do Chuyển</label>
                  <input
                    type="text"
                    value={formData.lyDoChuyen}
                    onChange={(e) => setFormData({ ...formData, lyDoChuyen: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editing ? 'Cập Nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

