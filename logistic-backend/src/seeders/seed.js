require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

// Import models
const User = require('../models/User');
const Customer = require('../models/Customer');
const Fleet = require('../models/Fleet');
const Location = require('../models/Location');
const Shipment = require('../models/Shipment');

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Sample data
const customers = [
  {
    id: 'CUST-001',
    name: 'PT. Maju Jaya',
    email: 'contact@majujaya.com',
    phone: '021-12345678',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    company: 'PT. Maju Jaya',
    totalShipments: 15
  },
  {
    id: 'CUST-002',
    name: 'CV. Berkah Sejahtera',
    email: 'info@berkahsejahtera.com',
    phone: '021-87654321',
    address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    company: 'CV. Berkah Sejahtera',
    totalShipments: 8
  },
  {
    id: 'CUST-003',
    name: 'Toko Elektronik Jaya',
    email: 'elektronikjaya@gmail.com',
    phone: '031-11223344',
    address: 'Jl. Basuki Rahmat No. 78, Surabaya',
    company: 'Toko Elektronik Jaya',
    totalShipments: 12
  },
  {
    id: 'CUST-004',
    name: 'PT. Global Logistics',
    email: 'support@globallogistics.com',
    phone: '022-99887766',
    address: 'Jl. Asia Afrika No. 90, Bandung',
    company: 'PT. Global Logistics',
    totalShipments: 20
  },
  {
    id: 'CUST-005',
    name: 'UD. Sumber Rezeki',
    email: 'sumberrezeki@yahoo.com',
    phone: '024-55667788',
    address: 'Jl. Pemuda No. 56, Semarang',
    company: 'UD. Sumber Rezeki',
    totalShipments: 5
  }
];

const fleet = [
  {
    id: 'FLT-001',
    plateNumber: 'B 1234 ABC',
    type: 'Truck',
    capacity: 5000,
    driver: 'Budi Santoso',
    status: 'Available',
    fuelType: 'Diesel',
    year: 2020,
    lastMaintenance: new Date('2024-10-15'),
    nextMaintenance: new Date('2025-01-15')
  },
  {
    id: 'FLT-002',
    plateNumber: 'B 5678 DEF',
    type: 'Van',
    capacity: 1500,
    driver: 'Ahmad Yani',
    status: 'On Route',
    fuelType: 'Petrol',
    year: 2021,
    lastMaintenance: new Date('2024-11-01'),
    nextMaintenance: new Date('2025-02-01')
  },
  {
    id: 'FLT-003',
    plateNumber: 'L 9012 GHI',
    type: 'Truck',
    capacity: 8000,
    driver: 'Siti Nurhaliza',
    status: 'Available',
    fuelType: 'Diesel',
    year: 2019,
    lastMaintenance: new Date('2024-09-20'),
    nextMaintenance: new Date('2024-12-20')
  },
  {
    id: 'FLT-004',
    plateNumber: 'D 3456 JKL',
    type: 'Container',
    capacity: 12000,
    driver: 'Rudi Hartono',
    status: 'Maintenance',
    fuelType: 'Diesel',
    year: 2022,
    lastMaintenance: new Date('2024-11-20'),
    nextMaintenance: new Date('2025-02-20')
  },
  {
    id: 'FLT-005',
    plateNumber: 'B 7890 MNO',
    type: 'Motorcycle',
    capacity: 50,
    driver: 'Andi Wijaya',
    status: 'Available',
    fuelType: 'Petrol',
    year: 2023,
    lastMaintenance: new Date('2024-11-10'),
    nextMaintenance: new Date('2025-01-10')
  },
  {
    id: 'FLT-006',
    plateNumber: 'B 2468 PQR',
    type: 'Van',
    capacity: 2000,
    driver: 'Dewi Lestari',
    status: 'On Route',
    fuelType: 'Electric',
    year: 2023,
    lastMaintenance: new Date('2024-10-25'),
    nextMaintenance: new Date('2025-01-25')
  }
];

const locations = [
  {
    id: 'LOC-001',
    name: 'Warehouse Jakarta Utara',
    cityName: 'Jakarta',
    type: 'Warehouse',
    address: 'Jl. Pluit Raya No. 100, Jakarta Utara',
    coordinates: {
      lat: -6.1352,
      lng: 106.7944
    },
    latitude: -6.1352,
    longitude: 106.7944,
    capacity: 50000,
    currentOccupancy: 35000,
    manager: 'Hendra Gunawan'
  },
  {
    id: 'LOC-002',
    name: 'Distribution Center Tangerang',
    cityName: 'Tangerang',
    type: 'Distribution Center',
    address: 'Jl. BSD Raya No. 45, Tangerang',
    coordinates: {
      lat: -6.2615,
      lng: 106.6492
    },
    latitude: -6.2615,
    longitude: 106.6492,
    capacity: 30000,
    currentOccupancy: 18000,
    manager: 'Sari Indah'
  },
  {
    id: 'LOC-003',
    name: 'Branch Surabaya',
    cityName: 'Surabaya',
    type: 'Branch',
    address: 'Jl. Raya Darmo No. 88, Surabaya',
    coordinates: {
      lat: -7.2575,
      lng: 112.7521
    },
    latitude: -7.2575,
    longitude: 112.7521,
    capacity: 20000,
    currentOccupancy: 12000,
    manager: 'Bambang Sutrisno'
  },
  {
    id: 'LOC-004',
    name: 'Warehouse Bandung',
    cityName: 'Bandung',
    type: 'Warehouse',
    address: 'Jl. Soekarno Hatta No. 200, Bandung',
    coordinates: {
      lat: -6.9175,
      lng: 107.6191
    },
    latitude: -6.9175,
    longitude: 107.6191,
    capacity: 40000,
    currentOccupancy: 25000,
    manager: 'Rina Marlina'
  },
  {
    id: 'LOC-005',
    name: 'Distribution Center Semarang',
    cityName: 'Semarang',
    type: 'Distribution Center',
    address: 'Jl. Pandanaran No. 150, Semarang',
    coordinates: {
      lat: -6.9932,
      lng: 110.4203
    },
    latitude: -6.9932,
    longitude: 110.4203,
    capacity: 25000,
    currentOccupancy: 15000,
    manager: 'Agus Salim'
  }
];

const shipments = [
  {
    id: 'TRK-10001',
    customer: {
      name: 'PT. Maju Jaya',
      phone: '021-12345678',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat'
    },
    origin: 'Jakarta',
    destination: 'Surabaya',
    weight: 2500,
    type: 'Electronics',
    status: 'In Transit',
    fleet: {
      id: 'FLT-002',
      plateNumber: 'B 5678 DEF',
      driver: 'Ahmad Yani'
    },
    estimatedDelivery: new Date('2025-11-28'),
    notes: 'Fragile items - handle with care'
  },
  {
    id: 'TRK-10002',
    customer: {
      name: 'CV. Berkah Sejahtera',
      phone: '021-87654321',
      address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan'
    },
    origin: 'Jakarta',
    destination: 'Bandung',
    weight: 1200,
    type: 'Food',
    status: 'Pending',
    estimatedDelivery: new Date('2025-11-27'),
    notes: 'Express delivery'
  },
  {
    id: 'TRK-10003',
    customer: {
      name: 'Toko Elektronik Jaya',
      phone: '031-11223344',
      address: 'Jl. Basuki Rahmat No. 78, Surabaya'
    },
    origin: 'Surabaya',
    destination: 'Jakarta',
    weight: 3500,
    type: 'Electronics',
    status: 'In Transit',
    fleet: {
      id: 'FLT-006',
      plateNumber: 'B 2468 PQR',
      driver: 'Dewi Lestari'
    },
    estimatedDelivery: new Date('2025-11-29'),
    notes: 'Electronics - keep dry'
  },
  {
    id: 'TRK-10004',
    customer: {
      name: 'PT. Global Logistics',
      phone: '022-99887766',
      address: 'Jl. Asia Afrika No. 90, Bandung'
    },
    origin: 'Bandung',
    destination: 'Semarang',
    weight: 4500,
    type: 'Furniture',
    status: 'Delivered',
    estimatedDelivery: new Date('2025-11-25'),
    actualDelivery: new Date('2025-11-25'),
    notes: 'Delivered on time'
  },
  {
    id: 'TRK-10005',
    customer: {
      name: 'UD. Sumber Rezeki',
      phone: '024-55667788',
      address: 'Jl. Pemuda No. 56, Semarang'
    },
    origin: 'Semarang',
    destination: 'Jakarta',
    weight: 800,
    type: 'General',
    status: 'Pending',
    estimatedDelivery: new Date('2025-11-30'),
    notes: 'Standard delivery'
  },
  {
    id: 'TRK-10006',
    customer: {
      name: 'PT. Maju Jaya',
      phone: '021-12345678',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat'
    },
    origin: 'Jakarta',
    destination: 'Bandung',
    weight: 1800,
    type: 'Perishable',
    status: 'Delivered',
    estimatedDelivery: new Date('2025-11-24'),
    actualDelivery: new Date('2025-11-24'),
    notes: 'Successfully delivered'
  },
  {
    id: 'TRK-10007',
    customer: {
      name: 'CV. Berkah Sejahtera',
      phone: '021-87654321',
      address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan'
    },
    origin: 'Jakarta',
    destination: 'Surabaya',
    weight: 2200,
    type: 'Fragile',
    status: 'Cancelled',
    estimatedDelivery: new Date('2025-11-26'),
    notes: 'Cancelled by customer'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Fleet.deleteMany({});
    await Location.deleteMany({});
    await Shipment.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create users with hashed passwords
    console.log('👥 Seeding users...');
    const users = [
      {
        username: 'admin',
        email: 'admin@logistic.com',
        password: await hashPassword('admin123'),
        fullName: 'System Administrator',
        role: 'ADMIN',
        phone: '08123456789'
      },
      {
        username: 'manager1',
        email: 'manager@logistic.com',
        password: await hashPassword('manager123'),
        fullName: 'John Manager',
        role: 'MANAGER',
        phone: '08123456790'
      },
      {
        username: 'staff1',
        email: 'staff@logistic.com',
        password: await hashPassword('staff123'),
        fullName: 'Jane Staff',
        role: 'STAFF',
        phone: '08123456791'
      },
      {
        username: 'driver1',
        email: 'driver@logistic.com',
        password: await hashPassword('driver123'),
        fullName: 'Mike Driver',
        role: 'DRIVER',
        phone: '08123456792'
      }
    ];

    // Insert users directly (bypass pre-save hook)
    await User.collection.insertMany(users);
    console.log(`✅ Created ${users.length} users`);

    // Seed Customers
    console.log('🏢 Seeding customers...');
    await Customer.insertMany(customers);
    console.log(`✅ Created ${customers.length} customers`);

    // Seed Fleet
    console.log('🚚 Seeding fleet...');
    await Fleet.insertMany(fleet);
    console.log(`✅ Created ${fleet.length} vehicles`);

    // Seed Locations
    console.log('📍 Seeding locations...');
    await Location.insertMany(locations);
    console.log(`✅ Created ${locations.length} locations`);

    // Seed Shipments
    console.log('📦 Seeding shipments...');
    await Shipment.insertMany(shipments);
    console.log(`✅ Created ${shipments.length} shipments`);

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Fleet: ${fleet.length}`);
    console.log(`   - Locations: ${locations.length}`);
    console.log(`   - Shipments: ${shipments.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin    - username: admin    | password: admin123');
    console.log('   Manager  - username: manager1 | password: manager123');
    console.log('   Staff    - username: staff1   | password: staff123');
    console.log('   Driver   - username: driver1  | password: driver123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
