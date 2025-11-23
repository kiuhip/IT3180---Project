<<<<<<< HEAD
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

### ⚡ CÁCH CHẠY NHANH NHẤT (Cho người mới - Khuyến nghị)

1. **Chuẩn bị Database trên XAMPP:**
   - Mở XAMPP Control Panel, bấm **Start** cho **MySQL**
   - Mở **phpMyAdmin**: http://localhost/phpmyadmin
   - Tạo database mới: **qlchungcu**
   - Import file: `Database/qlchungcu.sql`

2. **Tạo file cấu hình:**
   - Double-click file: **TAO_FILE_ENV.bat** (hoặc xem hướng dẫn bên dưới)

3. **Chạy Project:**
   - Double-click file: **RUN_PROJECT.bat**
   - Đợi vài giây, sẽ tự động mở 2 cửa sổ (Backend + Frontend)
   - Mở trình duyệt: **http://localhost:3000**

👉 **Xem hướng dẫn chi tiết:** `HUONG_DAN_CHAY_XAMPP.md` hoặc `HUONG_DAN_NHANH.md`

---

### 📝 CÁCH CHẠY THỦ CÔNG (Chi tiết)

#### Bước 1: Cài đặt Database

Đảm bảo MySQL đã được cài đặt và chạy (XAMPP hoặc MySQL riêng). Import database:

**Với XAMPP:**
- Mở phpMyAdmin: http://localhost/phpmyadmin
- Tạo database: **qlchungcu**
- Tab **Import** → Chọn file: `Database/qlchungcu.sql` → Bấm **Go**

**Với MySQL command line:**
```bash
mysql -u root -p qlchungcu < Database/qlchungcu.sql
```

#### Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

**Tạo file `.env`:**

Cách 1: Dùng script
- Chạy file: `TAO_FILE_ENV.bat` (ở thư mục gốc)

Cách 2: Tạo thủ công
- Tạo file `.env` trong thư mục `backend`
- Copy nội dung sau:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=qlchungcu
JWT_SECRET=your-secret-key-change-this-in-production
```

**Lưu ý:** Nếu MySQL có mật khẩu, sửa `DB_PASSWORD=` thành `DB_PASSWORD=mật_khẩu_của_bạn`

#### Bước 3: Cài đặt Frontend

```bash
cd frontend
npm install
```

#### Bước 4: Chạy Ứng Dụng

**Cách 1: Dùng Script (Đơn giản nhất)**
- Double-click file: **RUN_PROJECT.bat**

**Cách 2: Chạy Thủ Công**

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

## 📂 Các File Hỗ Trợ

Project bao gồm các file script tiện ích:

- **`RUN_PROJECT.bat`** - Chạy tự động cả Backend và Frontend (khuyến nghị)
- **`TAO_FILE_ENV.bat`** - Tạo file cấu hình `.env` tự động
- **`HUONG_DAN_CHAY_XAMPP.md`** - Hướng dẫn chi tiết bằng tiếng Việt
- **`HUONG_DAN_NHANH.md`** - Hướng dẫn nhanh 3 bước

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

=======
# IT3180-Project
>>>>>>> 33a323b53b113c0cb08f5bb5e035afd3460230d3
