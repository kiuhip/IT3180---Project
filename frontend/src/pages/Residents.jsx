import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    maHoKhau: '',
    hoTen: '',
    tuoi: '',
    gioiTinh: 'Nam',
    soCMND_CCCD: '',
    soDT: '',
    quanHe: 'Không',
  });

  useEffect(() => {
    fetchResidents();
    fetchHouseholds();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await api.get('/nhankhau');
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
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
      if (editing) {
        await api.put(`/nhankhau/${editing}`, formData);
      } else {
        await api.post('/nhankhau', formData);
      }
      fetchResidents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (soCCCD) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân khẩu này?')) return;
    try {
      await api.delete(`/nhankhau/${soCCCD}`);
      fetchResidents();
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (resident) => {
    setEditing(resident.SoCMND_CCCD);
    setFormData({
      maHoKhau: resident.MaHoKhau || '',
      hoTen: resident.HoTen,
      tuoi: resident.Tuoi,
      gioiTinh: resident.GioiTinh,
      soCMND_CCCD: resident.SoCMND_CCCD,
      soDT: resident.SoDT,
      quanHe: resident.QuanHe || 'Không',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      maHoKhau: '',
      hoTen: '',
      tuoi: '',
      gioiTinh: 'Nam',
      soCMND_CCCD: '',
      soDT: '',
      quanHe: 'Không',
    });
    setEditing(null);
  };

  const filteredResidents = residents.filter(
    (r) =>
      r.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.SoCMND_CCCD.includes(searchTerm) ||
      r.MaHoKhau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Nhân Khẩu</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin nhân khẩu trong chung cư</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm Nhân Khẩu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, CCCD hoặc mã hộ khẩu..."
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
                <th className="text-left p-3">Họ Tên</th>
                <th className="text-left p-3">Tuổi</th>
                <th className="text-left p-3">Giới Tính</th>
                <th className="text-left p-3">CCCD/CMND</th>
                <th className="text-left p-3">Số ĐT</th>
                <th className="text-left p-3">Mã Hộ Khẩu</th>
                <th className="text-left p-3">Quan Hệ</th>
                <th className="text-left p-3">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((resident) => (
                <tr key={resident.SoCMND_CCCD} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{resident.HoTen}</td>
                  <td className="p-3">{resident.Tuoi}</td>
                  <td className="p-3">{resident.GioiTinh}</td>
                  <td className="p-3">{resident.SoCMND_CCCD}</td>
                  <td className="p-3">{resident.SoDT}</td>
                  <td className="p-3">{resident.MaHoKhau}</td>
                  <td className="p-3">{resident.QuanHe}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(resident)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(resident.SoCMND_CCCD)}
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
              {editing ? 'Chỉnh Sửa Nhân Khẩu' : 'Thêm Nhân Khẩu Mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Họ Tên *</label>
                  <input
                    type="text"
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tuổi *</label>
                  <input
                    type="number"
                    value={formData.tuoi}
                    onChange={(e) => setFormData({ ...formData, tuoi: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giới Tính *</label>
                  <select
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CCCD/CMND *</label>
                  <input
                    type="text"
                    value={formData.soCMND_CCCD}
                    onChange={(e) => setFormData({ ...formData, soCMND_CCCD: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    disabled={!!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số Điện Thoại *</label>
                  <input
                    type="text"
                    value={formData.soDT}
                    onChange={(e) => setFormData({ ...formData, soDT: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mã Hộ Khẩu</label>
                  <select
                    value={formData.maHoKhau}
                    onChange={(e) => setFormData({ ...formData, maHoKhau: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Không</option>
                    {households.map((h) => (
                      <option key={h.MaHoKhau} value={h.MaHoKhau}>
                        {h.MaHoKhau} - {h.DiaChi}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quan Hệ</label>
                  <input
                    type="text"
                    value={formData.quanHe}
                    onChange={(e) => setFormData({ ...formData, quanHe: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Chủ Hộ, Vợ, Con, ..."
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

