# Logistic Management System

Sistem manajemen logistik berbasis web yang komprehensif dengan fitur tracking pengiriman, manajemen armada, customer management, dan analytics dashboard.

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Setup & Installation](#setup--installation)
- [User Roles & Permissions](#user-roles--permissions)
- [Dokumentasi](#dokumentasi)
- [API Documentation](#api-documentation)

## Tentang Project

Sistem Logistic Management ini dirancang untuk membantu perusahaan logistik dalam mengelola operasional sehari-hari, mulai dari tracking pengiriman, manajemen armada kendaraan, hingga analisis performa bisnis. Sistem ini dilengkapi dengan role-based access control (RBAC) untuk memastikan keamanan dan pembagian akses yang tepat.

### Keunggulan Sistem

- **Real-time Tracking** - Monitor status pengiriman secara real-time
- **Fleet Management** - Kelola armada kendaraan dengan efisien
- **Multi-role Support** - 4 role berbeda (Admin, Manager, Staff, Driver)
- **Interactive Dashboard** - Visualisasi data dengan charts dan maps
- **Responsive Design** - Tampilan optimal di desktop dan mobile
- **Secure Authentication** - JWT-based authentication dengan password hashing

## Fitur Utama

### 1. Dashboard & Analytics
- Overview statistik real-time (total shipments, fleet, customers)
- Interactive charts untuk analisis trend
- Activity logs untuk audit trail
- Export data untuk reporting

### 2. Shipment Management
- Create, read, update, delete shipments
- Track shipment status (Pending → In Transit → Delivered)
- Assign fleet ke shipment
- Estimasi dan actual delivery date
- Filter dan search shipments

### 3. Fleet Management
- Manajemen data kendaraan (plat nomor, tipe, kapasitas)
- Status kendaraan (Available, On Route, Maintenance)
- Jadwal maintenance tracking
- Driver assignment

### 4. Customer Management
- Database customer lengkap
- History shipments per customer
- Contact information management
- Customer activity tracking

### 5. Location Management
- Master data lokasi (warehouse, distribution center)
- Koordinat GPS untuk mapping
- Capacity management
- Location-based filtering

### 6. User Management (Admin only)
- Create dan manage user accounts
- Role assignment
- User activity monitoring
- Access control management

## Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **React Router DOM** - Routing
- **TailwindCSS** - Styling framework
- **Lucide React** - Icon library
- **React Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0** - ODM (Object Data Modeling)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## Struktur Project

```
LOGITECH/
├── docs/                           # Dokumentasi project
│   ├── uml-diagrams.md            # Class, ERD, Sequence diagrams
│   ├── uml-diagrams.html          # HTML version
│   ├── use-case-diagrams.md       # Use case diagrams per role
│   └── use-case-diagrams.html     # HTML version
│
├── logistic-backend/              # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # MongoDB connection
│   │   ├── models/                # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Shipment.js
│   │   │   ├── Fleet.js
│   │   │   ├── Customer.js
│   │   │   └── Location.js
│   │   ├── controllers/           # Business logic
│   │   │   ├── authController.js
│   │   │   ├── shipmentController.js
│   │   │   ├── fleetController.js
│   │   │   ├── customerController.js
│   │   │   ├── userController.js
│   │   │   └── locationController.js
│   │   ├── routes/                # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── shipmentRoutes.js
│   │   │   ├── fleetRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── locationRoutes.js
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── auth.js            # JWT & RBAC
│   │   │   └── errorHandler.js
│   │   └── server.js              # Entry point
│   ├── .env.example
│   ├── package.json
│   ├── README.md                  # Backend documentation
│   ├── API_TESTING.md             # API testing guide
│   └── SETUP_MONGODB.md           # MongoDB setup guide
│
└── logistic-frontend/             # Frontend React App
    ├── public/
    ├── src/
    │   ├── components/            # React components
    │   │   ├── Dashboard.js
    │   │   ├── Shipments.js
    │   │   ├── Fleet.js
    │   │   ├── Customers.js
    │   │   ├── Locations.js
    │   │   ├── Users.js
    │   │   ├── Login.js
    │   │   └── ...
    │   ├── App.js                 # Main app component
    │   ├── App.css
    │   └── index.js
    ├── package.json
    ├── tailwind.config.js
    └── README.md                  # Frontend documentation
```

## Setup & Installation

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v16 atau lebih baru)
- **npm** atau **yarn**
- **MongoDB** (local atau MongoDB Atlas)
- **Git**

### 1. Clone Repository

```bash
git clone <repository-url>
cd LOGITECH
```

### 2. Setup Backend

```bash
cd logistic-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file dengan konfigurasi Anda
# PORT=8080
# MONGODB_URI=mongodb://localhost:27017/logistic-db
# JWT_SECRET=your-secret-key
# JWT_EXPIRE=7d
# CORS_ORIGIN=http://localhost:3000

# Start MongoDB (jika menggunakan local)
# Windows: mongod
# Linux/Mac: sudo systemctl start mongod

# Run development server
npm run dev
```

Backend akan berjalan di `http://localhost:8080`

📖 **Dokumentasi lengkap**: Lihat [logistic-backend/README.md](logistic-backend/README.md)

### 3. Setup Frontend

```bash
cd logistic-frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Akses Aplikasi

1. Buka browser: `http://localhost:3000`
2. Register user pertama dengan role ADMIN
3. Login dan mulai gunakan sistem

## User Roles & Permissions

### ADMIN (Full Access)
- Semua fitur sistem
- User management (create, update, delete users)
- Manage semua modul (shipments, fleet, customers, locations)
- View reports & analytics
- Activity logs

### MANAGER
- Customer management (create, update, view)
- Fleet management (create, update, view, maintenance)
- Location management (create, update, view)
- Shipment management (create, update, assign fleet)
- View reports & analytics
- Tidak ada akses: User management

### STAFF
- Create shipments
- Update shipment status
- View customers
- Track shipments
- View dashboard
- Tidak ada akses: Fleet management
- Tidak ada akses: User management

### DRIVER
- View assigned shipments
- Update shipment status
- Track shipments
- View dashboard
- Tidak ada akses: Create shipments
- Tidak ada akses: Manage fleet/customers

## Dokumentasi

### UML Diagrams

Dokumentasi lengkap sistem dalam bentuk UML diagrams tersedia di folder `docs/`:

1. **[Class Diagram](docs/uml-diagrams.md#1-class-diagram)** - Struktur model/entitas
2. **[ERD (Entity Relationship Diagram)](docs/uml-diagrams.md#2-entity-relationship-diagram-erd)** - Relasi database
3. **[Use Case Diagrams](docs/use-case-diagrams.md)** - Interaksi user per role
4. **[Sequence Diagrams](docs/uml-diagrams.md#4-sequence-diagram---create-shipment-flow)** - Flow proses bisnis
5. **[State Diagram](docs/uml-diagrams.md#6-state-diagram---shipment-status)** - Status transitions
6. **[Component Diagram](docs/uml-diagrams.md#7-component-diagram---system-architecture)** - Arsitektur sistem
7. **[Deployment Diagram](docs/uml-diagrams.md#8-deployment-diagram)** - Deployment architecture
8. **[Activity Diagram](docs/uml-diagrams.md#9-activity-diagram---fleet-assignment-process)** - Proses bisnis detail

### Viewing Diagrams

Diagram menggunakan **Mermaid** syntax. Untuk melihat:

1. **VS Code**: Install extension "Markdown Preview Mermaid Support"
2. **GitHub/GitLab**: Otomatis ter-render
3. **Online**: Copy ke [Mermaid Live Editor](https://mermaid.live/)
4. **HTML Version**: Buka file `.html` di browser

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register user baru | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

### Shipments Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/shipments` | Get all shipments | All |
| GET | `/shipments/:id` | Get single shipment | All |
| POST | `/shipments` | Create shipment | ADMIN, MANAGER, STAFF |
| PUT | `/shipments/:id` | Update shipment | ADMIN, MANAGER |
| PUT | `/shipments/:id/status` | Update status | All |
| DELETE | `/shipments/:id` | Delete shipment | ADMIN, MANAGER |

### Fleet Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/fleet` | Get all vehicles | All |
| GET | `/fleet/:id` | Get single vehicle | All |
| POST | `/fleet` | Create vehicle | ADMIN, MANAGER |
| PUT | `/fleet/:id` | Update vehicle | ADMIN, MANAGER |
| DELETE | `/fleet/:id` | Delete vehicle | ADMIN, MANAGER |

### Customers Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/customers` | Get all customers | All |
| GET | `/customers/:id` | Get single customer | All |
| POST | `/customers` | Create customer | ADMIN, MANAGER, STAFF |
| PUT | `/customers/:id` | Update customer | ADMIN, MANAGER, STAFF |
| DELETE | `/customers/:id` | Delete customer | ADMIN, MANAGER |

### Locations Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/locations` | Get all locations | All |
| GET | `/locations/:id` | Get single location | All |
| POST | `/locations` | Create location | ADMIN, MANAGER |
| PUT | `/locations/:id` | Update location | ADMIN, MANAGER |
| DELETE | `/locations/:id` | Delete location | ADMIN, MANAGER |

### Users Endpoints (Admin Only)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/users` | Get all users | ADMIN |
| GET | `/users/:id` | Get single user | ADMIN |
| POST | `/users` | Create user | ADMIN |
| PUT | `/users/:id` | Update user | ADMIN |
| DELETE | `/users/:id` | Delete user | ADMIN |

### Authentication Header

Untuk protected routes, sertakan JWT token di header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**API Testing Guide**: Lihat [logistic-backend/API_TESTING.md](logistic-backend/API_TESTING.md)

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs untuk enkripsi password
- **RBAC** - Role-based access control
- **Input Validation** - Express validator untuk sanitasi input
- **CORS Protection** - Configured CORS policy
- **Error Handling** - Centralized error handling
- **Activity Logging** - Audit trail untuk semua actions

## Testing

### Backend Testing

```bash
cd logistic-backend

# Test API endpoints menggunakan curl atau Postman
# Lihat API_TESTING.md untuk contoh requests
```

### Frontend Testing

```bash
cd logistic-frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Production Build

### Backend

```bash
cd logistic-backend
npm start
```

### Frontend

```bash
cd logistic-frontend

# Build production bundle
npm run build

# Serve build folder dengan web server (nginx, apache, dll)
```

## Troubleshooting

### Backend tidak bisa connect ke MongoDB

```bash
# Cek apakah MongoDB running
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl status mongod

# Atau gunakan MongoDB Atlas (cloud)
# Update MONGODB_URI di .env dengan connection string dari Atlas
```

### Port sudah digunakan

```bash
# Ubah PORT di .env (backend)
PORT=8081

# Atau kill process yang menggunakan port
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8080 | xargs kill -9
```

### CORS Error

Pastikan `CORS_ORIGIN` di backend `.env` sesuai dengan URL frontend:

```env
CORS_ORIGIN=http://localhost:3000
```

## Contributing

Contributions are welcome! Untuk berkontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Developer

Developed for Logitech Logistics Management System

## Support

Jika ada pertanyaan atau masalah:

1. Cek dokumentasi di folder `docs/`
2. Lihat README masing-masing folder (backend/frontend)
3. Cek troubleshooting section di atas
4. Open issue di repository

---

**Happy Coding!**
