import { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, CheckCircle, XCircle } from 'lucide-react';

export default function Fees() {
  const [selectedFeeType, setSelectedFeeType] = useState('phidichvu');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const feeTypes = [
    { value: 'phidichvu', label: 'Phí Dịch Vụ' },
    { value: 'phiquanly', label: 'Phí Quản Lý' },
    { value: 'phiguixe', label: 'Phí Gửi Xe' },
    { value: 'phisinhhoat', label: 'Phí Sinh Hoạt' },
  ];

  useEffect(() => {
    fetchFeeData();
  }, [selectedFeeType, selectedYear]);

  const fetchFeeData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/fees/${selectedFeeType}/${selectedYear}`);
      setFeeData(response.data);
    } catch (error) {
      console.error('Error fetching fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFee = async (maHoKhau, thang) => {
    if (selectedFeeType === 'phisinhhoat') {
      alert('Vui lòng cập nhật phí sinh hoạt trước khi thanh toán');
      return;
    }

    if (!confirm(`Xác nhận thanh toán phí tháng ${thang} cho hộ khẩu ${maHoKhau}?`)) return;

    try {
      await api.put(`/fees/${selectedFeeType}/pay`, {
        maHoKhau,
        thang,
        nam: selectedYear,
      });
      fetchFeeData();
      alert('Thanh toán thành công!');
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const getMonthStatus = (household, month) => {
    const columnName = `Thang${month}`;
    const amount = household[columnName] || 0;
    const tienNopMoiThang = household.TienNopMoiThang || 0;
    
    if (amount > 0) {
      return { paid: true, amount };
    }
    return { paid: false, amount: tienNopMoiThang };
  };

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Phí</h1>
        <p className="text-gray-600 mt-2">Theo dõi và quản lý các loại phí trong chung cư</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 items-center flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-1">Loại Phí</label>
            <select
              value={selectedFeeType}
              onChange={(e) => setSelectedFeeType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {feeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Năm</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border rounded-lg"
              min="2020"
              max="2030"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Mã Hộ Khẩu</th>
              {months.map((month, index) => (
                <th key={index} className="text-center p-3 min-w-[120px]">
                  {month}
                </th>
              ))}
              <th className="text-center p-3">Tiền Nộp/Tháng</th>
            </tr>
          </thead>
          <tbody>
            {feeData.map((household) => {
              const tienNopMoiThang = household.TienNopMoiThang || 0;
              return (
                <tr key={household.MaHoKhau} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{household.MaHoKhau}</td>
                  {months.map((_, monthIndex) => {
                    const month = monthIndex + 1;
                    const status = getMonthStatus(household, month);
                    return (
                      <td key={monthIndex} className="p-2 text-center">
                        {status.paid ? (
                          <div className="flex flex-col items-center">
                            <CheckCircle className="text-green-600 mb-1" size={20} />
                            <span className="text-xs text-gray-600">
                              {new Intl.NumberFormat('vi-VN').format(status.amount)} đ
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePayFee(household.MaHoKhau, month)}
                            className="flex flex-col items-center text-red-600 hover:text-red-800"
                          >
                            <XCircle className="mb-1" size={20} />
                            <span className="text-xs">
                              {new Intl.NumberFormat('vi-VN').format(status.amount)} đ
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(tienNopMoiThang)} đ
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedFeeType === 'phisinhhoat' && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Lưu ý:</strong> Phí sinh hoạt cần được cập nhật (tiền điện, nước, internet) trước khi có thể thanh toán.
          </p>
        </div>
      )}
    </div>
  );
}

