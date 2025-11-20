import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, Search } from 'lucide-react';

export default function TamVang() {
  const [records, setRecords] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    maTamVang: '',
    soCMND_CCCD: '',
    noiTamTru: '',
    tuNgay: '',
    denNgay: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchResidents();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/tamvang');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching tam vang:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await api.get('/nhankhau');
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tamvang', formData);
      fetchRecords();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (maTamVang) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
    try {
      await api.delete(`/tamvang/${maTamVang}`);
      fetchRecords();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      maTamVang: '',
      soCMND_CCCD: '',
      noiTamTru: '',
      tuNgay: '',
      denNgay: '',
    });
  };

  const filteredRecords = records.filter(
    (r) =>
      r.SoCMND_CCCD.includes(searchTerm) ||
      r.MaTamVang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Tạm Vắng</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin tạm vắng của nhân khẩu</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm Tạm Vắng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã tạm vắng hoặc CCCD..."
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
                <th className="text-left p-3">Mã Tạm Vắng</th>
                <th className="text-left p-3">CCCD/CMND</th>
                <th className="text-left p-3">Nơi Tạm Trú</th>
                <th className="text-left p-3">Từ Ngày</th>
                <th className="text-left p-3">Đến Ngày</th>
                <th className="text-left p-3">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.MaTamVang} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{record.MaTamVang}</td>
                  <td className="p-3">{record.SoCMND_CCCD}</td>
                  <td className="p-3">{record.NoiTamTru}</td>
                  <td className="p-3">
                    {new Date(record.TuNgay).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3">
                    {new Date(record.DenNgay).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(record.MaTamVang)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Thêm Tạm Vắng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã Tạm Vắng *</label>
                  <input
                    type="text"
                    value={formData.maTamVang}
                    onChange={(e) => setFormData({ ...formData, maTamVang: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CCCD/CMND *</label>
                  <select
                    value={formData.soCMND_CCCD}
                    onChange={(e) => setFormData({ ...formData, soCMND_CCCD: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Chọn nhân khẩu</option>
                    {residents.map((r) => (
                      <option key={r.SoCMND_CCCD} value={r.SoCMND_CCCD}>
                        {r.SoCMND_CCCD} - {r.HoTen}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nơi Tạm Trú *</label>
                  <input
                    type="text"
                    value={formData.noiTamTru}
                    onChange={(e) => setFormData({ ...formData, noiTamTru: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Từ Ngày *</label>
                  <input
                    type="date"
                    value={formData.tuNgay}
                    onChange={(e) => setFormData({ ...formData, tuNgay: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đến Ngày *</label>
                  <input
                    type="date"
                    value={formData.denNgay}
                    onChange={(e) => setFormData({ ...formData, denNgay: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
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

