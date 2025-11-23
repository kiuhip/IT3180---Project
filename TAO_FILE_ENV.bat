@echo off
chcp 65001 >nul
title Tạo File Cấu Hình .env

echo.
echo ========================================
echo   TẠO FILE CẤU HÌNH .env CHO BACKEND
echo ========================================
echo.

if exist "backend\.env" (
    echo [CẢNH BÁO] File .env đã tồn tại!
    echo.
    set /p confirm="Bạn có muốn ghi đè lên file cũ không? (y/n): "
    if /i not "%confirm%"=="y" (
        echo Đã hủy.
        pause
        exit /b
    )
)

echo.
echo Nhập thông tin cấu hình MySQL của XAMPP:
echo.
echo [LƯU Ý] 
echo - DB_USER thường là: root
echo - DB_PASSWORD: Nếu XAMPP không có mật khẩu, để trống và bấm Enter
echo - DB_NAME thường là: qlchungcu
echo.

set /p DB_USER="DB_USER (mặc định: root): "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASSWORD="DB_PASSWORD (để trống nếu không có mật khẩu): "

set /p DB_NAME="DB_NAME (mặc định: qlchungcu): "
if "%DB_NAME%"=="" set DB_NAME=qlchungcu

(
    echo PORT=5000
    echo DB_HOST=localhost
    echo DB_USER=%DB_USER%
    echo DB_PASSWORD=%DB_PASSWORD%
    echo DB_NAME=%DB_NAME%
    echo JWT_SECRET=your-secret-key-change-this-in-production-123456
) > backend\.env

echo.
echo [✓] Đã tạo file backend\.env thành công!
echo.
echo Nội dung file:
type backend\.env
echo.
pause

