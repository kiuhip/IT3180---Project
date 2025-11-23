# 📖 HƯỚNG DẪN CHI TIẾT CHẠY PROJECT VỚI XAMPP

## 🎯 Yêu Cầu Trước Khi Bắt Đầu

1. **XAMPP** đã được cài đặt trên máy tính (Download tại: https://www.apachefriends.org/)
2. **Node.js** đã được cài đặt (Download tại: https://nodejs.org/) - **PHẢI CÓ ĐIỀU NÀY**
3. Mở **Command Prompt** hoặc **PowerShell** (Windows) hoặc **Terminal** (Mac/Linux)

---

## 📋 BƯỚC 1: KHỞI ĐỘNG XAMPP VÀ TẠO DATABASE

### 1.1. Khởi động XAMPP
- Mở ứng dụng **XAMPP Control Panel**
- Bấm nút **Start** cho module **Apache** (nếu cần)
- **QUAN TRỌNG**: Bấm nút **Start** cho module **MySQL** - **PHẢI BẬT**

### 1.2. Tạo Database bằng phpMyAdmin
1. Mở trình duyệt, vào: **http://localhost/phpmyadmin**
2. Ở menu bên trái, bấm nút **New** để tạo database mới
3. Đặt tên database là: **qlchungcu**
4. Chọn **Collation**: **utf8_unicode_ci** hoặc **utf8mb4_unicode_ci**
5. Bấm nút **Create** (Tạo)

### 1.3. Import file SQL vào database
1. Trong phpMyAdmin, chọn database **qlchungcu** vừa tạo (bấm vào tên database ở menu trái)
2. Bấm tab **Import** ở trên cùng
3. Bấm nút **Choose File** và chọn file: `Database/qlchungcu.sql`
   - Đường dẫn đầy đủ: `C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\Database\qlchungcu.sql`
4. Cuộn xuống dưới, bấm nút **Go** (Chạy)
5. Đợi vài giây để import xong. Nếu thành công sẽ hiện thông báo màu xanh

---

## 📋 BƯỚC 2: CÀI ĐẶT BACKEND

### 2.1. Mở Command Prompt/PowerShell
- Bấm phím **Windows** trên bàn phím
- Gõ **cmd** hoặc **powershell** và bấm Enter
- Hoặc bấm chuột phải vào thư mục project → **Open in Terminal**

### 2.2. Di chuyển vào thư mục backend
Copy và dán lệnh này vào Command Prompt, rồi bấm Enter:

```cmd
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\backend"
```

**HOẶC** nếu bạn đã ở trong thư mục project, chỉ cần gõ:
```cmd
cd backend
```

### 2.3. Cài đặt các thư viện cần thiết cho Backend
Copy và dán lệnh này, rồi bấm Enter:

```cmd
npm install
```

**Lưu ý**: 
- Lần đầu tiên sẽ mất vài phút để tải về
- Phải đảm bảo có kết nối internet
- Nếu gặp lỗi, thử chạy lại lệnh

### 2.4. Tạo file cấu hình .env
Tạo file `.env` trong thư mục `backend` với nội dung sau:

**Cách 1: Dùng Notepad**
1. Mở **Notepad** (nhấn Windows + R, gõ `notepad`, Enter)
2. Copy nội dung sau và dán vào:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=qlchungcu
JWT_SECRET=your-secret-key-change-this-in-production-123456
```

3. Lưu file với tên: `.env` (có dấu chấm ở đầu)
4. **QUAN TRỌNG**: Khi lưu, chọn **All Files** thay vì Text Document
5. Lưu vào thư mục: `C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\backend`

**Lưu ý về mật khẩu MySQL:**
- Nếu XAMPP của bạn đặt mật khẩu cho MySQL là `123456`, thì sửa dòng `DB_PASSWORD=` thành `DB_PASSWORD=123456`
- Nếu XAMPP của bạn KHÔNG có mật khẩu (mặc định), để trống như trên: `DB_PASSWORD=`

**Cách 2: Dùng Command Prompt**
Copy và dán từng dòng này vào Command Prompt (đang ở thư mục backend):

```cmd
echo PORT=5000 > .env
echo DB_HOST=localhost >> .env
echo DB_USER=root >> .env
echo DB_PASSWORD= >> .env
echo DB_NAME=qlchungcu >> .env
echo JWT_SECRET=your-secret-key-change-this-in-production-123456 >> .env
```

---

## 📋 BƯỚC 3: CÀI ĐẶT FRONTEND

### 3.1. Mở Command Prompt/PowerShell MỚI
- Mở một cửa sổ Command Prompt/PowerShell khác (giữ cửa sổ backend vẫn mở)
- Hoặc mở tab mới trong terminal

### 3.2. Di chuyển vào thư mục frontend
Copy và dán lệnh này:

```cmd
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\frontend"
```

Hoặc nếu đã ở thư mục project:
```cmd
cd frontend
```

### 3.3. Cài đặt các thư viện cần thiết cho Frontend
Copy và dán lệnh này:

```cmd
npm install
```

Đợi vài phút để cài đặt xong.

---

## 📋 BƯỚC 4: CHẠY PROJECT

### Cách 1: Chạy bằng File Script (KHUYẾN NGHỊ - ĐƠN GIẢN NHẤT)

1. **Đảm bảo XAMPP MySQL đang chạy**
2. **Đóng tất cả các cửa sổ Command Prompt/PowerShell**
3. **Double-click** vào file `RUN_PROJECT.bat` trong thư mục project
4. Đợi vài giây, sẽ tự động mở 2 cửa sổ:
   - Cửa sổ 1: Chạy Backend (port 5000)
   - Cửa sổ 2: Chạy Frontend (port 3000)
5. Đợi đến khi cả 2 cửa sổ hiển thị "Server is running" hoặc "ready"
6. Mở trình duyệt, vào: **http://localhost:3000**

### Cách 2: Chạy Thủ Công (Bằng 2 Command Prompt)

**Terminal 1 - Chạy Backend:**
```cmd
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\backend"
npm run dev
```

Đợi đến khi thấy dòng: `🚀 Server is running on port 5000`

**Terminal 2 - Chạy Frontend:**
```cmd
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\frontend"
npm run dev
```

Đợi đến khi thấy dòng tương tự: `Local: http://localhost:3000/`

---

## 🔐 ĐĂNG NHẬP VÀO HỆ THỐNG

1. Mở trình duyệt (Chrome, Firefox, Edge...)
2. Vào địa chỉ: **http://localhost:3000**
3. Trang đăng nhập sẽ hiện ra
4. Nhập thông tin:
   - **Username**: `admin`
   - **Password**: `123456`
5. Bấm nút **Đăng nhập**

---

## ✅ KIỂM TRA XEM ĐÃ CHẠY ĐÚNG CHƯA

### Backend đang chạy nếu:
- Cửa sổ Command Prompt hiển thị: `🚀 Server is running on port 5000`
- Vào trình duyệt: **http://localhost:5000/api/health** → Hiện thông báo JSON

### Frontend đang chạy nếu:
- Cửa sổ Command Prompt hiển thị thông báo về port 3000
- Vào trình duyệt: **http://localhost:3000** → Hiện trang đăng nhập

---

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "npm is not recognized"
**Nguyên nhân**: Chưa cài Node.js hoặc chưa thêm vào PATH
**Giải pháp**: 
- Tải và cài Node.js từ: https://nodejs.org/
- Sau khi cài xong, **RESTART** máy tính
- Mở lại Command Prompt và thử lại

### Lỗi 2: "Cannot connect to database"
**Nguyên nhân**: XAMPP MySQL chưa chạy hoặc cấu hình .env sai
**Giải pháp**:
- Kiểm tra XAMPP Control Panel, MySQL phải bật (màu xanh)
- Kiểm tra file `.env` trong thư mục `backend`, đảm bảo `DB_PASSWORD` đúng
- Kiểm tra database `qlchungcu` đã được tạo chưa

### Lỗi 3: "Port 5000 already in use" hoặc "Port 3000 already in use"
**Nguyên nhân**: Đã có chương trình khác dùng port này
**Giải pháp**:
- Đóng tất cả cửa sổ Command Prompt
- Hoặc đổi port trong file `.env` (backend) và `vite.config.js` (frontend)

### Lỗi 4: "Module not found"
**Nguyên nhân**: Chưa chạy `npm install`
**Giải pháp**:
- Vào thư mục `backend`, chạy: `npm install`
- Vào thư mục `frontend`, chạy: `npm install`

### Lỗi 5: Không mở được phpMyAdmin
**Nguyên nhân**: XAMPP Apache chưa chạy
**Giải pháp**: 
- Trong XAMPP Control Panel, bấm Start cho Apache
- Hoặc chỉ cần MySQL là đủ (không cần Apache để chạy project này)

---

## 📝 TÓM TẮT CÁC LỆNH CẦN CHẠY

**Mở Command Prompt và chạy lần lượt:**

```cmd
REM 1. Cài đặt Backend
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\backend"
npm install

REM 2. Cài đặt Frontend (mở Command Prompt mới)
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\frontend"
npm install

REM 3. Chạy Backend (mở Command Prompt mới)
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\backend"
npm run dev

REM 4. Chạy Frontend (mở Command Prompt mới)
cd "C:\Users\vuvui\OneDrive\Máy tính\IT3180---Project-main\IT3180---Project-main\frontend"
npm run dev
```

**HOẶC ĐƠN GIẢN HƠN:**
- Chỉ cần double-click file `RUN_PROJECT.bat` là xong!

---

## 🎉 HOÀN TẤT!

Nếu làm đúng các bước trên, bạn sẽ có:
- ✅ Database đã được tạo và import
- ✅ Backend chạy tại: http://localhost:5000
- ✅ Frontend chạy tại: http://localhost:3000
- ✅ Có thể đăng nhập và sử dụng hệ thống

**Chúc bạn thành công! 🚀**

