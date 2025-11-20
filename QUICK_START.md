# 🚀 Hướng Dẫn Chạy Nhanh

## Bước 1: Cài đặt Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Bước 2: Cấu hình Database

1. Đảm bảo MySQL đã chạy
2. Import database:
```bash
mysql -u root -p qlchungcu < ../NMCNPM.20232-Nhom4-main/src/Database/qlchungcu.sql
```

3. Tạo file `.env` trong thư mục `backend`:
```bash
cd backend
cp .env.example .env
```

4. Chỉnh sửa `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=qlchungcu
JWT_SECRET=your-secret-key-here
```

## Bước 3: Chạy Ứng Dụng

Mở 2 terminal:

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

## Bước 4: Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Đăng Nhập

- Username: `admin`
- Password: `123456`

## ✅ Hoàn tất!

Bạn đã sẵn sàng sử dụng hệ thống quản lý chung cư!

