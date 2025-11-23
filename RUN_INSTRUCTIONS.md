# 🚀 Apartment Management System - Complete Setup Guide

This guide will walk you through setting up and running the Apartment Management System step by step.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MySQL** or **MariaDB** - [Download MySQL](https://dev.mysql.com/downloads/) or [Download MariaDB](https://mariadb.org/download/)
3. **npm** (comes with Node.js) or **yarn**
4. A code editor (VS Code recommended)

### Verify Installation

Open your terminal and run:

```bash
node --version    # Should show v16.x or higher
npm --version     # Should show 8.x or higher
mysql --version   # Should show MySQL version
```

---

## 📦 Step 1: Install Dependencies

### Option A: Install All at Once (Recommended)

From the project root directory:

```bash
npm run install:all
```

This will install dependencies for both backend and frontend.

### Option B: Install Separately

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Start MySQL Service

**On macOS:**
```bash
brew services start mysql
# or
mysql.server start
```

**On Linux:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

**On Windows:**
- Open Services and start MySQL service, or
- Use MySQL Workbench to start the server

### 2.2 Create Database

Log into MySQL:

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

Then run:

```sql
CREATE DATABASE IF NOT EXISTS qlchungcu;
EXIT;
```

### 2.3 Import Database Schema

From the project root directory:

```bash
mysql -u root -p qlchungcu < Database/qlchungcu.sql
```

**Alternative method (if above doesn't work):**

```bash
cd Database
mysql -u root -p qlchungcu < qlchungcu.sql
cd ..
```

**Using MySQL Workbench:**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to Server → Data Import
4. Select "Import from Self-Contained File"
5. Choose `Database/qlchungcu.sql`
6. Select default target schema: `qlchungcu`
7. Click "Start Import"

### 2.4 Verify Database Import

```bash
mysql -u root -p qlchungcu -e "SHOW TABLES;"
```

You should see tables like: `hokhau`, `nhankhau`, `user`, `phidichvu`, etc.

---

## ⚙️ Step 3: Backend Configuration

### 3.1 Create Environment File

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file:

**On macOS/Linux:**
```bash
touch .env
```

**On Windows:**
```bash
type nul > .env
```

### 3.2 Configure Environment Variables

Open the `.env` file and add the following configuration:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=qlchungcu

# JWT Secret Key (Change this to a random string in production!)
JWT_SECRET=apartment-management-secret-key-2024

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## 🎨 Step 4: Frontend Configuration

The frontend is already configured to proxy API requests to the backend. No additional configuration needed!

**Note:** The frontend runs on port 3000 by default (configured in `frontend/vite.config.js`).

---

## 🚀 Step 5: Run the Application

You need to run both backend and frontend servers. Open **two separate terminal windows/tabs**.

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
📡 API available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
```

**If you see database connection errors:**
- Check your MySQL service is running
- Verify `.env` file has correct database credentials
- Ensure database `qlchungcu` exists and is imported

### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🌐 Step 6: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the login page

### Default Login Credentials

After importing the database, you can login with:

- **Username:** `admin`
- **Password:** `123456`

**Note:** If these credentials don't work, check the `user` table in your database:

```sql
SELECT * FROM user;
```

If no user exists, create one:

```sql
INSERT INTO user (UserName, Password, HoTen, Email, SoDT, DiaChi, Tuoi) 
VALUES ('admin', '123456', 'Administrator', 'admin@example.com', '0123456789', 'Chung Cư', 30);
```

---

## ✅ Verification Checklist

Before using the application, verify:

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Database connection is successful (check backend terminal)
- [ ] Can access http://localhost:3000
- [ ] Can login with default credentials
- [ ] API health check works: http://localhost:5000/api/health

---

## 🛠️ Troubleshooting

### Problem: Database Connection Failed

**Solution:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify database exists: `SHOW DATABASES;`
3. Check `.env` file has correct credentials
4. Ensure database name is `qlchungcu`

### Problem: Port Already in Use

**Solution:**
- Backend (port 5000): Change `PORT` in `.env` file
- Frontend (port 3000): Change port in `frontend/vite.config.js`

### Problem: Module Not Found Errors

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: CORS Errors

**Solution:**
- Ensure backend is running
- Check `FRONTEND_URL` in backend `.env` matches frontend URL
- Verify frontend proxy configuration in `vite.config.js`

### Problem: Authentication Errors

**Solution:**
1. Clear browser localStorage
2. Check `JWT_SECRET` in `.env` is set
3. Try logging in again

### Problem: Database Import Failed

**Solution:**
1. Ensure MySQL is running
2. Check file path: `Database/qlchungcu.sql`
3. Verify file encoding is UTF-8
4. Try importing via MySQL Workbench instead

---

## 📝 Development Commands

### Backend Commands

```bash
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Frontend Commands

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Root Level Commands

```bash
# Install all dependencies
npm run install:all

# Run backend in dev mode
npm run dev:backend

# Run frontend in dev mode
npm run dev:frontend

# Build frontend
npm run build:frontend
```

---

## 🏗️ Project Structure

```
CNPM/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── hokhau.js            # Household management
│   │   ├── nhankhau.js          # Resident management
│   │   ├── fees.js              # Fee management
│   │   ├── phidonggop.js        # Contribution fees
│   │   ├── tamtru.js            # Temporary residence
│   │   ├── tamvang.js           # Temporary absence
│   │   ├── thanhtoan.js         # Payment records
│   │   └── statistics.js        # Statistics
│   ├── server.js                # Main server file
│   ├── .env                     # Environment variables (create this)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Main layout
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/               # All page components
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── Database/
│   └── qlchungcu.sql           # Database schema
│
└── RUN_INSTRUCTIONS.md         # This file
```

---

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains sensitive information
2. **Change JWT_SECRET** - Use a strong, random secret in production
3. **Use strong passwords** - For both MySQL and application users
4. **Enable HTTPS** - In production environments
5. **Database credentials** - Keep them secure and never expose them

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check console/terminal for error messages
4. Ensure all steps were followed correctly

---

## 🎉 You're All Set!

Your Apartment Management System should now be running successfully!

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

Happy coding! 🚀

