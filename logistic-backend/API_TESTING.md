# API Testing Guide

Panduan testing API menggunakan berbagai tools.

## 1. Testing dengan Browser

### Health Check
Buka browser dan akses:
```
http://localhost:8080/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Logistic Backend API is running",
  "timestamp": "2025-11-26T14:20:13.000Z"
}
```

---

## 2. Testing dengan PowerShell (Windows)

### Register User
```powershell
$body = @{
    username = "admin"
    email = "admin@example.com"
    password = "admin123"
    fullName = "Admin User"
    role = "ADMIN"
    phone = "08123456789"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Login
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

### Get Shipments (Protected Route)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/shipments" -Method GET -Headers $headers
```

### Create Shipment
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    id = "TRK-12345"
    customer = @{
        name = "PT. Test Customer"
        phone = "08123456789"
        address = "Jakarta"
    }
    origin = "Jakarta"
    destination = "Surabaya"
    weight = 1000
    status = "Pending"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/shipments" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

---

## 3. Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"email\":\"admin@example.com\",\"password\":\"admin123\",\"fullName\":\"Admin User\",\"role\":\"ADMIN\",\"phone\":\"08123456789\"}"
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Get Shipments
```bash
curl -X GET http://localhost:8080/api/shipments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 4. Testing dengan Postman

### Setup

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import Collection** (optional): Bisa buat collection sendiri

### Create Requests

#### 1. Register User
- Method: `POST`
- URL: `http://localhost:8080/api/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "fullName": "Admin User",
  "role": "ADMIN",
  "phone": "08123456789"
}
```

#### 2. Login
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Save the token from response!**

#### 3. Get Shipments
- Method: `GET`
- URL: `http://localhost:8080/api/shipments`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`

#### 4. Create Fleet
- Method: `POST`
- URL: `http://localhost:8080/api/fleet`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "id": "FLT-001",
  "plateNumber": "B 1234 XYZ",
  "type": "Truck",
  "capacity": 5000,
  "driver": "John Doe",
  "status": "Available",
  "fuelType": "Diesel",
  "year": 2020
}
```

#### 5. Create Customer
- Method: `POST`
- URL: `http://localhost:8080/api/customers`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "id": "CUST-001",
  "name": "PT. Test Customer",
  "email": "customer@test.com",
  "phone": "08123456789",
  "address": "Jakarta Selatan",
  "company": "PT. Test"
}
```

#### 6. Create Location
- Method: `POST`
- URL: `http://localhost:8080/api/locations`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "id": "LOC-001",
  "name": "Warehouse Jakarta",
  "type": "Warehouse",
  "address": "Jakarta Utara",
  "coordinates": {
    "lat": -6.2088,
    "lng": 106.8456
  },
  "capacity": 10000,
  "currentOccupancy": 5000,
  "manager": "Manager Name"
}
```

---

## 5. Testing dengan Thunder Client (VS Code Extension)

1. Install extension "Thunder Client" di VS Code
2. Buat request seperti di Postman
3. Lebih ringan dan terintegrasi dengan VS Code

---

## 6. Quick Test Script

Buat file `test-api.ps1`:

```powershell
# Test API Script
Write-Host "🧪 Testing Logistic Backend API" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n1️⃣ Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/health"
    Write-Host "✅ Health Check: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed" -ForegroundColor Red
    exit
}

# 2. Login
Write-Host "`n2️⃣ Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login Success! Token: $($token.Substring(0,20))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Login Failed" -ForegroundColor Red
    exit
}

# 3. Get Shipments
Write-Host "`n3️⃣ Testing Get Shipments..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $shipments = Invoke-RestMethod -Uri "http://localhost:8080/api/shipments" -Method GET -Headers $headers
    Write-Host "✅ Shipments Retrieved: $($shipments.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Shipments Failed" -ForegroundColor Red
}

Write-Host "`n✨ All tests completed!" -ForegroundColor Cyan
```

Jalankan:
```powershell
.\test-api.ps1
```

---

## Expected Responses

### Success Response (200/201)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (4xx/5xx)
```json
{
  "message": "Error message here"
}
```

### Authentication Error (401)
```json
{
  "message": "Not authorized, no token"
}
```

### Authorization Error (403)
```json
{
  "message": "Role STAFF is not authorized to access this route"
}
```

---

## Tips

1. **Save Token**: Setelah login, save token untuk request selanjutnya
2. **Use Environment Variables**: Di Postman, buat environment variable untuk token
3. **Check Console**: Lihat backend console untuk error details
4. **MongoDB Compass**: Gunakan untuk lihat data di database secara visual
