# ⚡ HƯỚNG DẪN CHẠY NHANH PROJECT

## 🎯 3 BƯỚC ĐƠN GIẢN

### BƯỚC 1: Chuẩn Bị Database trên XAMPP

1. **Mở XAMPP Control Panel**
   - Bấm **Start** cho **MySQL** (phải có màu xanh)

2. **Tạo Database**
   - Mở trình duyệt: **http://localhost/phpmyadmin**
   - Bấm **New** (Tạo mới) ở menu trái
   - Tên database: **qlchungcu**
   - Collation: **utf8_unicode_ci**
   - Bấm **Create**

3. **Import Database**
   - Chọn database **qlchungcu** vừa tạo
   - Tab **Import** → Chọn file: `Database/qlchungcu.sql`
   - Bấm **Go** (Chạy)

---

### BƯỚC 2: Tạo File Cấu Hình

**Cách 1: Dùng Script (Khuyến nghị)**
- Double-click file: **TAO_FILE_ENV.bat**
- Làm theo hướng dẫn

**Cách 2: Tạo Thủ Công**
- Vào thư mục `backend`
- Tạo file tên: `.env`
- Copy nội dung sau vào:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=qlchungcu
JWT_SECRET=your-secret-key-change-this-in-production-123456
```

**Lưu ý**: Nếu MySQL của bạn có mật khẩu, sửa dòng `DB_PASSWORD=` thành `DB_PASSWORD=mật_khẩu_của_bạn`

---

### BƯỚC 3: Chạy Project

**Cách Đơn Giản Nhất:**
- Double-click file: **RUN_PROJECT.bat**
- Đợi vài giây, sẽ mở 2 cửa sổ
- Khi thấy "Server is running", mở trình duyệt: **http://localhost:3000**

**Đăng nhập:**
- Username: `admin`
- Password: `123456`

---

## ❓ NẾU GẶP LỖI

### Lỗi: "npm is not recognized"
→ **PHẢI CÀI NODE.JS TRƯỚC!**
- Tải tại: https://nodejs.org/
- Cài đặt, sau đó **RESTART** máy tính

### Lỗi: "Cannot connect to database"
→ Kiểm tra:
1. XAMPP MySQL đã bật chưa?
2. File `.env` trong thư mục `backend` đã có chưa?
3. Database `qlchungcu` đã được tạo và import chưa?

### Lỗi: "Module not found"
→ Chạy script `RUN_PROJECT.bat`, nó sẽ tự động cài đặt

---

## 📝 TÓM TẮT

1. ✅ XAMPP MySQL → Bật
2. ✅ phpMyAdmin → Tạo database `qlchungcu` → Import `qlchungcu.sql`
3. ✅ Chạy `TAO_FILE_ENV.bat` để tạo file `.env`
4. ✅ Chạy `RUN_PROJECT.bat` để khởi động project
5. ✅ Mở trình duyệt: **http://localhost:3000**

**Xong! 🎉**

---

👉 **Xem hướng dẫn chi tiết tại:** `HUONG_DAN_CHAY_XAMPP.md`

