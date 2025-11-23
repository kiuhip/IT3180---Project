import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, Search } from 'lucide-react';

export default function PhiDongGop() {
  const [contributions, setContributions] = useState([]);
  const [contributionTypes, setContributionTypes] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [formData, setFormData] = useState({
    maHoKhau: '',
    tenPhi: '',
    soTien: '',
    ngayDongGop: '',
  });
  const [typeFormData, setTypeFormData] = useState({
    tenPhi: '',
    soTienGoiY: '',
  });

  useEffect(() => {
    fetchContributions();
    fetchContributionTypes();
    fetchHouseholds();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await api.get('/phidonggop');
      setContributions(response.data);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContributionTypes = async () => {
    try {
      const response = await api.get('/phidonggop/types');
      setContributionTypes(response.data);
    } catch (error) {
      console.error('Error fetching contribution types:', error);
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
      await api.post('/phidonggop', {
        ...formData,
        soTien: parseFloat(formData.soTien),
      });
      fetchContributions();
      setShowModal(false);
      setFormData({ maHoKhau: '', tenPhi: '', soTien: '', ngayDongGop: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/phidonggop/types', {
        ...typeFormData,
        soTienGoiY: parseFloat(typeFormData.soTienGoiY),
      });
      fetchContributionTypes();
      setShowTypeModal(false);
      setTypeFormData({ tenPhi: '', soTienGoiY: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteType = async (tenPhi) => {
    if (!confirm('Bạn có chắc chắn muốn xóa loại phí này?')) return;
    try {
      await api.delete(`/phidonggop/types/${tenPhi}`);
      fetchContributionTypes();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const filteredContributions = contributions.filter(
    (c) =>
      c.MaHoKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.TenPhi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phí Đóng Góp</h1>
          <p className="text-gray-600 mt-2">Quản lý các khoản đóng góp tự nguyện</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTypeModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm Loại Phí
          </button>
          <button
            onClick={() => {
              setFormData({ maHoKhau: '', tenPhi: '', soTien: '', ngayDongGop: '' });
              setShowModal(true);
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm Đóng Góp
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Danh Sách Loại Phí</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contributionTypes.map((type) => (
            <div key={type.TenPhi} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{type.TenPhi}</p>
                <p className="text-sm text-gray-600">
                  Gợi ý: {new Intl.NumberFormat('vi-VN').format(type.SoTienGoiY)} đ
                </p>
              </div>
              <button
                onClick={() => handleDeleteType(type.TenPhi)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hộ khẩu hoặc tên phí..."
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
                <th className="text-left p-3">Tên Phí</th>
                <th className="text-left p-3">Số Tiền</th>
                <th className="text-left p-3">Ngày Đóng Góp</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.map((contribution, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{contribution.MaHoKhau}</td>
                  <td className="p-3">{contribution.TenPhi}</td>
                  <td className="p-3">
                    {new Intl.NumberFormat('vi-VN').format(contribution.SoTien)} đ
                  </td>
                  <td className="p-3">
                    {new Date(contribution.NgayDongGop).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Thêm Đóng Góp</h2>
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
                <label className="block text-sm font-medium mb-1">Tên Phí</label>
                <select
                  value={formData.tenPhi}
                  onChange={(e) => setFormData({ ...formData, tenPhi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Chọn loại phí</option>
                  {contributionTypes.map((type) => (
                    <option key={type.TenPhi} value={type.TenPhi}>
                      {type.TenPhi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số Tiền (đồng)</label>
                <input
                  type="number"
                  value={formData.soTien}
                  onChange={(e) => setFormData({ ...formData, soTien: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày Đóng Góp</label>
                <input
                  type="date"
                  value={formData.ngayDongGop}
                  onChange={(e) => setFormData({ ...formData, ngayDongGop: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ maHoKhau: '', tenPhi: '', soTien: '', ngayDongGop: '' });
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

      {showTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Thêm Loại Phí</h2>
            <form onSubmit={handleTypeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên Phí *</label>
                <input
                  type="text"
                  value={typeFormData.tenPhi}
                  onChange={(e) => setTypeFormData({ ...typeFormData, tenPhi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số Tiền Gợi ý (đồng) *</label>
                <input
                  type="number"
                  value={typeFormData.soTienGoiY}
                  onChange={(e) =>
                    setTypeFormData({ ...typeFormData, soTienGoiY: e.target.value })
                  }
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
                    setShowTypeModal(false);
                    setTypeFormData({ tenPhi: '', soTienGoiY: '' });
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

