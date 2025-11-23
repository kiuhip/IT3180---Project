@echo off
chcp 65001 >nul
title Chạy Project Quản Lý Chung Cư

echo.
echo ========================================
echo   HỆ THỐNG QUẢN LÝ CHUNG CƯ
echo   Đang khởi động...
echo ========================================
echo.

REM Kiểm tra Node.js đã cài chưa
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Node.js chưa được cài đặt!
    echo Vui lòng tải và cài Node.js từ: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js đã được cài đặt
echo.

REM Kiểm tra file .env trong backend
if not exist "backend\.env" (
    echo [CẢNH BÁO] File .env chưa tồn tại trong thư mục backend!
    echo Đang tạo file .env mặc định...
    echo.
    
    (
        echo PORT=5000
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=qlchungcu
        echo JWT_SECRET=your-secret-key-change-this-in-production-123456
    ) > backend\.env
    
    echo [✓] Đã tạo file .env mặc định
    echo [!] Vui lòng kiểm tra và sửa file backend\.env nếu MySQL của bạn có mật khẩu
    echo.
    timeout /t 3 >nul
)

REM Kiểm tra node_modules trong backend
if not exist "backend\node_modules" (
    echo [THÔNG BÁO] Đang cài đặt thư viện cho Backend...
    echo Điều này có thể mất vài phút, vui lòng đợi...
    echo.
    cd backend
    call npm install
    cd ..
    echo.
)

REM Kiểm tra node_modules trong frontend
if not exist "frontend\node_modules" (
    echo [THÔNG BÁO] Đang cài đặt thư viện cho Frontend...
    echo Điều này có thể mất vài phút, vui lòng đợi...
    echo.
    cd frontend
    call npm install
    cd ..
    echo.
)

echo ========================================
echo   Đang khởi động Backend và Frontend...
echo ========================================
echo.
echo [LƯU Ý] Đảm bảo XAMPP MySQL đã được bật!
echo.
echo Để dừng project, đóng cả 2 cửa sổ này hoặc bấm Ctrl+C
echo.
timeout /t 3 >nul

REM Khởi động Backend trong cửa sổ mới
echo [BACKEND] Đang khởi động Backend trên port 5000...
start "Backend Server - Port 5000" cmd /k "cd /d %~dp0backend && npm run dev"

REM Đợi 5 giây để backend khởi động
timeout /t 5 >nul

REM Khởi động Frontend trong cửa sổ mới
echo [FRONTEND] Đang khởi động Frontend trên port 3000...
start "Frontend Server - Port 3000" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   ✓ Khởi động thành công!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Sau khi thấy "Server is running" và "ready", 
echo hãy mở trình duyệt và vào: http://localhost:3000
echo.
echo Thông tin đăng nhập:
echo   Username: admin
echo   Password: 123456
echo.
echo ========================================
echo.
echo [TIP] Để dừng project, đóng cả 2 cửa sổ Command Prompt
echo.
pause

