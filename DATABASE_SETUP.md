# 🗄️ Database Connection Guide

Complete step-by-step guide to connect your MySQL database to the Apartment Management System.

## 📋 Prerequisites

1. **MySQL or MariaDB installed** on your system
2. **MySQL root password** (or user credentials with database creation privileges)

---

## 🔧 Step 1: Start MySQL Service

### On macOS:
```bash
# Using Homebrew
brew services start mysql

# Or manually
mysql.server start
```

### On Linux:
```bash
# Using systemd
sudo systemctl start mysql

# Or using service
sudo service mysql start
```

### On Windows:
- Open **Services** (Win + R, type `services.msc`)
- Find **MySQL** service
- Right-click → **Start**

Or use MySQL Workbench to start the server.

---

## 🗄️ Step 2: Create the Database

### Option A: Using Command Line

1. **Open Terminal/Command Prompt**

2. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL root password when prompted.

3. **Create the database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS qlchungcu;
   ```

4. **Verify database was created:**
   ```sql
   SHOW DATABASES;
   ```
   You should see `qlchungcu` in the list.

5. **Exit MySQL:**
   ```sql
   EXIT;
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click the **SQL Editor** icon (or press `Ctrl+Shift+E`)
4. Run this command:
   ```sql
   CREATE DATABASE IF NOT EXISTS qlchungcu;
   ```
5. Click the **Execute** button (⚡)

---

## 📥 Step 3: Import Database Schema

### Option A: Using Command Line (Recommended)

From the project root directory (`/Users/kieuhiep/Documents/CNPM`):

```bash
mysql -u root -p qlchungcu < Database/qlchungcu.sql
```

**What this does:**
- `-u root` - Uses root user
- `-p` - Prompts for password
- `qlchungcu` - Target database name
- `< Database/qlchungcu.sql` - Imports the SQL file

**Alternative path (if above doesn't work):**
```bash
cd Database
mysql -u root -p qlchungcu < qlchungcu.sql
cd ..
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Go to **Server** → **Data Import**
4. Select **Import from Self-Contained File**
5. Click **Browse** and select: `Database/qlchungcu.sql`
6. Under **Default Target Schema**, select `qlchungcu` (or create it if it doesn't exist)
7. Click **Start Import**

### Option C: Copy-Paste SQL Commands

1. Open `Database/qlchungcu.sql` in a text editor
2. Copy all the SQL commands
3. In MySQL Workbench or command line, paste and execute

---

## ✅ Step 4: Verify Database Import

### Check Tables Were Created:

```bash
mysql -u root -p qlchungcu -e "SHOW TABLES;"
```

You should see tables like:
- `hokhau`
- `nhankhau`
- `user`
- `phidichvu`
- `phiquanly`
- `phiguixe`
- `phisinhhoat`
- `danhsachphidonggop`
- `tamtru`
- `tamvang`
- `thanhtoan`
- `capnhatphisinhhoat`

### Check Sample Data:

```bash
mysql -u root -p qlchungcu -e "SELECT * FROM user LIMIT 5;"
```

---

## ⚙️ Step 5: Configure Backend Connection

### 5.1 Navigate to Backend Directory

```bash
cd backend
```

### 5.2 Create .env File

**On macOS/Linux:**
```bash
touch .env
```

**On Windows:**
```bash
type nul > .env
```

**Or manually create** a file named `.env` in the `backend` folder.

### 5.3 Add Database Configuration

Open the `.env` file and add these lines:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=qlchungcu

# JWT Secret Key
JWT_SECRET=apartment-management-secret-key-2024

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Replace `your_mysql_password_here` with your actual MySQL root password!

**Example:**
```env
DB_PASSWORD=MySecurePassword123
```

---

## 🧪 Step 6: Test Database Connection

### 6.1 Start the Backend Server

```bash
cd backend
npm run dev
```

### 6.2 Check Connection Status

You should see one of these messages:

**✅ Success:**
```
✅ Database connected successfully
🚀 Server is running on port 5000
📡 API available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
```

**❌ Failure:**
```
❌ Database connection failed: Access denied for user 'root'@'localhost'
Please check your database configuration in .env file
```

---

## 🔍 Troubleshooting

### Problem 1: "Access denied for user"

**Solution:**
- Check your MySQL password in `.env` file
- Verify MySQL user has proper permissions:
  ```sql
  GRANT ALL PRIVILEGES ON qlchungcu.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Problem 2: "Unknown database 'qlchungcu'"

**Solution:**
- Database doesn't exist. Create it:
  ```sql
  CREATE DATABASE qlchungcu;
  ```
- Or check `.env` file has correct `DB_NAME`

### Problem 3: "Can't connect to MySQL server"

**Solution:**
- MySQL service is not running. Start it:
  ```bash
  # macOS
  brew services start mysql
  
  # Linux
  sudo systemctl start mysql
  
  # Windows
  # Start MySQL service from Services
  ```
- Check MySQL is listening on port 3306:
  ```bash
  # macOS/Linux
  lsof -i :3306
  
  # Windows
  netstat -an | findstr 3306
  ```

### Problem 4: "ER_NOT_SUPPORTED_AUTH_MODE"

**Solution:**
This happens when MySQL 8.0+ uses `caching_sha2_password` authentication.

**Fix:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Problem 5: Import Failed - "Table already exists"

**Solution:**
Drop and recreate the database:
```sql
DROP DATABASE IF EXISTS qlchungcu;
CREATE DATABASE qlchungcu;
```
Then re-import the schema.

### Problem 6: Connection Timeout

**Solution:**
- Check firewall settings
- Verify MySQL is accessible:
  ```bash
  mysql -u root -p -h localhost
  ```
- Try changing `DB_HOST` to `127.0.0.1` instead of `localhost`

---

## 🔐 Security Best Practices

1. **Don't use root user in production**
   - Create a dedicated database user:
     ```sql
     CREATE USER 'apartment_user'@'localhost' IDENTIFIED BY 'strong_password';
     GRANT ALL PRIVILEGES ON qlchungcu.* TO 'apartment_user'@'localhost';
     FLUSH PRIVILEGES;
     ```
   - Then use this user in `.env`:
     ```env
     DB_USER=apartment_user
     DB_PASSWORD=strong_password
     ```

2. **Use strong passwords**
   - At least 12 characters
   - Mix of letters, numbers, and symbols

3. **Never commit .env file**
   - Already in `.gitignore`
   - Keep credentials secure

---

## 📊 Verify Connection with Test Query

You can test the connection by running a simple query:

```bash
mysql -u root -p qlchungcu -e "SELECT COUNT(*) as total_households FROM hokhau;"
```

This should return the number of households in the database.

---

## ✅ Connection Checklist

Before proceeding, verify:

- [ ] MySQL service is running
- [ ] Database `qlchungcu` exists
- [ ] Database schema imported successfully
- [ ] `.env` file created in `backend` folder
- [ ] `.env` file has correct database credentials
- [ ] Backend server starts without connection errors
- [ ] You see "✅ Database connected successfully" message

---

## 🎯 Quick Reference

### Default Database Configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=qlchungcu
```

### Common MySQL Commands:
```bash
# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE qlchungcu;

# Show tables
SHOW TABLES;

# Check table structure
DESCRIBE hokhau;

# Exit MySQL
EXIT;
```

---

## 🆘 Still Having Issues?

1. **Check MySQL version:**
   ```bash
   mysql --version
   ```

2. **Check if MySQL is running:**
   ```bash
   # macOS/Linux
   ps aux | grep mysql
   
   # Windows
   tasklist | findstr mysql
   ```

3. **Check MySQL error logs:**
   - macOS: `/usr/local/var/mysql/*.err`
   - Linux: `/var/log/mysql/error.log`
   - Windows: MySQL installation directory

4. **Test connection manually:**
   ```bash
   mysql -u root -p -h localhost
   ```

---

**Once you see "✅ Database connected successfully", your database is properly configured!** 🎉

