# Hệ Thống Quản Lý Chung Cư - Web Application

Ứng dụng web hiện đại để quản lý chung cư với giao diện đẹp và công nghệ đơn giản.

## 🚀 Công Nghệ Sử Dụng

### Backend
- **Node.js** với **Express.js**
- **MySQL** database
- **JWT** cho authentication

### Frontend
- **React** với **Vite**
- **Tailwind CSS** cho styling
- **React Router** cho navigation
- **Recharts** cho biểu đồ thống kê
- **Axios** cho API calls

## 📋 Yêu Cầu Hệ Thống

1. **Node.js** (v16 trở lên)
2. **MySQL** hoặc **MariaDB**
3. **npm** hoặc **yarn**

## 🔧 Cài Đặt

### Bước 1: Cài đặt Database

Đảm bảo MySQL đã được cài đặt và chạy. Import database từ file SQL:

```bash
mysql -u root -p qlchungcu < ../NMCNPM.20232-Nhom4-main/src/Database/qlchungcu.sql
```

Hoặc sử dụng file SQL trong thư mục `NMCNPM.20232-Nhom4-main/src/Database/qlchungcu.sql`

### Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=qlchungcu
JWT_SECRET=your-secret-key-change-this-in-production
```

### Bước 3: Cài đặt Frontend

```bash
cd frontend
npm install
```

### Bước 4: Chạy Ứng Dụng

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Thông Tin Đăng Nhập Mặc Định

Sau khi import database, bạn có thể đăng nhập với:
- **Username:** `admin`
- **Password:** `123456`

Hoặc tạo user mới trong database:

```sql
INSERT INTO user (UserName, Password, HoTen, Email, SoDT, DiaChi, Tuoi) 
VALUES ('admin', '123456', 'Administrator', 'admin@example.com', '0123456789', 'Chung Cư', 30);
```

## 📁 Cấu Trúc Project

```
web-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Cấu hình kết nối database
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── hokhau.js            # Household routes
│   │   ├── nhankhau.js          # Resident routes
│   │   ├── fees.js              # Fee management routes
│   │   ├── phidonggop.js        # Contribution fee routes
│   │   ├── tamtru.js            # Temporary residence routes
│   │   ├── tamvang.js           # Temporary absence routes
│   │   ├── thanhtoan.js         # Payment routes
│   │   └── statistics.js       # Statistics routes
│   ├── server.js                # Main server file
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx       # Main layout component
    │   ├── contexts/
    │   │   └── AuthContext.jsx  # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx        # Login page
    │   │   ├── Dashboard.jsx    # Dashboard/Home page
    │   │   ├── Households.jsx  # Household management
    │   │   ├── Residents.jsx   # Resident management
    │   │   ├── Fees.jsx         # Fee management
    │   │   ├── Payments.jsx     # Payment management
    │   │   ├── Statistics.jsx   # Statistics page
    │   │   ├── TamTru.jsx      # Temporary residence
    │   │   ├── TamVang.jsx      # Temporary absence
    │   │   └── PhiDongGop.jsx  # Contribution fees
    │   ├── services/
    │   │   └── api.js           # API service
    │   ├── App.jsx              # Main app component
    │   └── main.jsx             # Entry point
    └── package.json
```

## ✨ Tính Năng

### 1. Quản Lý Hộ Khẩu
- Xem danh sách hộ khẩu
- Thêm, sửa, xóa hộ khẩu
- Quản lý thông tin: địa chỉ, diện tích, số lượng xe

### 2. Quản Lý Nhân Khẩu
- Xem danh sách nhân khẩu
- Thêm, sửa, xóa nhân khẩu
- Liên kết nhân khẩu với hộ khẩu

### 3. Quản Lý Phí
- Phí Dịch Vụ
- Phí Quản Lý
- Phí Gửi Xe
- Phí Sinh Hoạt (điện, nước, internet)
- Theo dõi thanh toán theo tháng

### 4. Phí Đóng Góp
- Quản lý các loại phí đóng góp tự nguyện
- Ghi nhận đóng góp của các hộ khẩu

### 5. Tạm Trú / Tạm Vắng
- Quản lý thông tin tạm trú
- Quản lý thông tin tạm vắng

### 6. Thanh Toán
- Ghi nhận các giao dịch thanh toán
- Xem lịch sử thanh toán

### 7. Thống Kê
- Dashboard tổng quan
- Biểu đồ thống kê
- Báo cáo các loại phí chưa thanh toán

## 🛠️ Scripts

### Backend
- `npm start` - Chạy production server
- `npm run dev` - Chạy development server với nodemon

### Frontend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build

## 📝 Ghi Chú

- Database schema giữ nguyên từ hệ thống JavaFX gốc
- API sử dụng JWT authentication
- Frontend sử dụng React hooks và context API
- Giao diện responsive, hỗ trợ mobile

## 🐛 Xử Lý Lỗi

### Lỗi kết nối database
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin trong file `.env`
- Kiểm tra database `qlchungcu` đã được tạo chưa

### Lỗi CORS
- Backend đã cấu hình CORS, đảm bảo frontend chạy đúng port

### Lỗi authentication
- Kiểm tra JWT_SECRET trong `.env`
- Kiểm tra token trong localStorage

## 📄 License

Dự án học tập - Không có license cụ thể

