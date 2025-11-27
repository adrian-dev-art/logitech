# Logistic Management System - Backend API

Backend API untuk sistem manajemen logistik menggunakan Express.js dan MongoDB.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
logistic-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Shipment.js          # Shipment model
│   │   ├── Fleet.js             # Fleet/Vehicle model
│   │   ├── Customer.js          # Customer model
│   │   └── Location.js          # Location model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── shipmentController.js
│   │   ├── fleetController.js
│   │   ├── customerController.js
│   │   ├── userController.js
│   │   └── locationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── shipmentRoutes.js
│   │   ├── fleetRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── userRoutes.js
│   │   └── locationRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT & RBAC middleware
│   │   └── errorHandler.js      # Error handling
│   └── server.js                # Main application file
├── .env.example                 # Environment variables template
├── .gitignore
└── package.json
```

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/logistic-db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Install & Start MongoDB

**Windows:**
- Download MongoDB dari [mongodb.com](https://www.mongodb.com/try/download/community)
- Install dan jalankan sebagai service
- Atau jalankan manual: `mongod`

**Atau gunakan MongoDB Atlas (Cloud):**
- Buat cluster gratis di [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Ganti `MONGODB_URI` dengan connection string dari Atlas

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8080`

### 5. Run Production Server

```bash
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Shipments
- `GET /api/shipments` - Get all shipments (Protected)
- `GET /api/shipments/:id` - Get single shipment (Protected)
- `POST /api/shipments` - Create shipment (ADMIN, MANAGER, STAFF)
- `PUT /api/shipments/:id` - Update shipment (ADMIN, MANAGER)
- `PUT /api/shipments/:id/status` - Update status (Protected)
- `DELETE /api/shipments/:id` - Delete shipment (ADMIN, MANAGER)

### Fleet
- `GET /api/fleet` - Get all vehicles (Protected)
- `GET /api/fleet/:id` - Get single vehicle (Protected)
- `POST /api/fleet` - Create vehicle (ADMIN, MANAGER)
- `PUT /api/fleet/:id` - Update vehicle (ADMIN, MANAGER)
- `DELETE /api/fleet/:id` - Delete vehicle (ADMIN, MANAGER)

### Customers
- `GET /api/customers` - Get all customers (Protected)
- `GET /api/customers/:id` - Get single customer (Protected)
- `POST /api/customers` - Create customer (ADMIN, MANAGER, STAFF)
- `PUT /api/customers/:id` - Update customer (ADMIN, MANAGER, STAFF)
- `DELETE /api/customers/:id` - Delete customer (ADMIN, MANAGER)

### Users
- `GET /api/users` - Get all users (ADMIN only)
- `GET /api/users/:id` - Get single user (ADMIN only)
- `POST /api/users` - Create user (ADMIN only)
- `PUT /api/users/:id` - Update user (ADMIN only)
- `DELETE /api/users/:id` - Delete user (ADMIN only)

### Locations
- `GET /api/locations` - Get all locations (Protected)
- `GET /api/locations/:id` - Get single location (Protected)
- `POST /api/locations` - Create location (ADMIN, MANAGER)
- `PUT /api/locations/:id` - Update location (ADMIN, MANAGER)
- `DELETE /api/locations/:id` - Delete location (ADMIN, MANAGER)

## 🔐 User Roles

- **ADMIN** - Full access
- **MANAGER** - Manage shipments, fleet, customers, locations
- **STAFF** - Manage shipments, customers
- **DRIVER** - View fleet, update shipment status

## 🧪 Testing API

### 1. Register User

```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "fullName": "Admin User",
  "role": "ADMIN",
  "phone": "08123456789"
}
```

### 2. Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response akan berisi `token` yang harus digunakan untuk request selanjutnya.

### 3. Access Protected Routes

```bash
GET http://localhost:8080/api/shipments
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔧 Development

- `npm run dev` - Run with nodemon (auto-reload)
- `npm start` - Run production server

## 📝 Notes

- Frontend expect backend di `http://localhost:8080/api`
- Semua routes kecuali auth memerlukan JWT token
- Role-based access control (RBAC) sudah diimplementasikan
- Password di-hash menggunakan bcryptjs
- Error handling sudah centralized

## 🤝 Integration dengan Frontend

Frontend sudah dikonfigurasi untuk connect ke backend ini. Pastikan:

1. Backend running di port 8080
2. MongoDB running
3. CORS enabled untuk `http://localhost:3000`
4. JWT token disimpan di localStorage frontend

## 📧 Support

Jika ada masalah, cek:
- MongoDB sudah running
- Environment variables sudah benar
- Port 8080 tidak digunakan aplikasi lain
