# Setup MongoDB untuk Windows

## Opsi 1: MongoDB Local (Recommended untuk Development)

### Download & Install

1. **Download MongoDB Community Server**
   - Kunjungi: https://www.mongodb.com/try/download/community
   - Pilih versi: Windows x64
   - Download dan install

2. **Install MongoDB**
   - Jalankan installer
   - Pilih "Complete" installation
   - Centang "Install MongoDB as a Service"
   - Centang "Install MongoDB Compass" (GUI tool)

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**

   MongoDB biasanya auto-start sebagai Windows Service. Jika tidak:

   ```powershell
   # Start service
   net start MongoDB

   # Stop service
   net stop MongoDB

   # Check status
   sc query MongoDB
   ```

5. **Test Connection**
   ```powershell
   mongosh
   ```

   Jika berhasil, kamu akan masuk ke MongoDB shell.

### MongoDB Compass (GUI)

MongoDB Compass sudah terinstall otomatis. Buka aplikasinya dan connect ke:
```
mongodb://localhost:27017
```

---

## Opsi 2: MongoDB Atlas (Cloud - Gratis)

Jika tidak mau install local, gunakan MongoDB Atlas:

### Setup MongoDB Atlas

1. **Buat Akun**
   - Kunjungi: https://www.mongodb.com/cloud/atlas/register
   - Sign up gratis

2. **Buat Cluster**
   - Pilih "Create a FREE Cluster"
   - Pilih provider: AWS/Google Cloud/Azure (terserah)
   - Pilih region terdekat (Singapore recommended)
   - Cluster Name: logistic-cluster
   - Klik "Create Cluster"

3. **Setup Database Access**
   - Klik "Database Access" di sidebar
   - Klik "Add New Database User"
   - Username: `logistic_user`
   - Password: `logistic123` (atau password lain)
   - User Privileges: "Read and write to any database"
   - Klik "Add User"

4. **Setup Network Access**
   - Klik "Network Access" di sidebar
   - Klik "Add IP Address"
   - Klik "Allow Access from Anywhere" (untuk development)
   - Klik "Confirm"

5. **Get Connection String**
   - Kembali ke "Database" (Clusters)
   - Klik "Connect" pada cluster kamu
   - Pilih "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://logistic_user:<password>@logistic-cluster.xxxxx.mongodb.net/logistic-db?retryWrites=true&w=majority
   ```

6. **Update .env**

   Edit file `.env` di backend, ganti `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://logistic_user:logistic123@logistic-cluster.xxxxx.mongodb.net/logistic-db?retryWrites=true&w=majority
   ```

   **PENTING:** Ganti `<password>` dengan password yang kamu buat, dan ganti `xxxxx` dengan cluster ID kamu.

---

## Troubleshooting

### Error: "MongooseServerSelectionError"

**Solusi:**
- Pastikan MongoDB service running (jika local)
- Cek connection string di `.env`
- Cek network/firewall

### Error: "Authentication failed"

**Solusi:**
- Cek username/password di connection string
- Pastikan user sudah dibuat di MongoDB Atlas

### Port 27017 sudah digunakan

**Solusi:**
```powershell
# Cek process yang pakai port 27017
netstat -ano | findstr :27017

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <PID> /F
```

---

## Next Steps

Setelah MongoDB ready:

1. **Start Backend**
   ```bash
   cd d:\FREELANCE\LOGITECH\logistic-backend
   npm run dev
   ```

2. **Cek Console**
   - Harus muncul: `✅ MongoDB Connected`
   - Harus muncul: `✅ Default admin user created`

3. **Test API**
   - Buka browser: http://localhost:8080/health
   - Harus return: `{"status":"OK",...}`

4. **Login ke Frontend**
   - Username: `admin`
   - Password: `admin123`
