import React, { useState, useEffect } from 'react';
import { Search, Bell, UserCircle, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Import Components
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ShipmentListView from './components/ShipmentListView';
import FleetGridView from './components/FleetGridView';
import CustomerListView from './components/CustomerListView';
import UserListView from './components/UserListView';
import LocationListView from './components/LocationListView';
import LoginView from './components/LoginView';
import SettingsView from './components/SettingsView';
import ActivityLogView from './components/ActivityLogView';

const API_BASE_URL = 'http://localhost:8080/api';

// --- KOMPONEN UTAMA APLIKASI (WRAPPER AUTH) ---
export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('logistic_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('logistic_user', JSON.stringify(userData));
  };

  const handleUpdateSession = (updatedUser) => {
    const safeUser = { ...user, ...updatedUser };
    setUser(safeUser);
    localStorage.setItem('logistic_user', JSON.stringify(safeUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('logistic_user');
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginView onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/*"
          element={user ? <MainLayout user={user} onLogout={handleLogout} onUpdateSession={handleUpdateSession} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

// --- TATA LETAK UTAMA & LOGIKA BISNIS ---
function MainLayout({ user, onLogout, onUpdateSession }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // State Filter Status

  // State Data
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();

  // --- HELPER: Get Auth Headers ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem('logistic_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // --- 1. DEFINISI FUNGSI FETCH ---
  const fetchShipments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shipments`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setShipments(await res.json());
      else if (res.status === 401) { onLogout(); }
    } catch (e) { setError("Gagal terhubung ke Backend"); }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/fleet`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setVehicles(await res.json());
    } catch (e) { }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setCustomers(await res.json());
    } catch (e) { }
  };

  const fetchAppUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setAppUsers(await res.json());
    } catch (e) { }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/locations`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setLocations(await res.json());
    } catch (e) { }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/drivers/available`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setDrivers(await res.json());
    } catch (e) { }
  };

  // --- 2. INITIAL LOAD ---
  useEffect(() => {
    fetchShipments();
    fetchVehicles();
    fetchCustomers();

    // Load data sensitif hanya jika role mengizinkan
    if (hasAccess(['ADMIN'])) fetchAppUsers();
    if (hasAccess(['ADMIN', 'MANAGER'])) {
      fetchDrivers(); // Fetch available drivers for fleet assignment
    }
    if (hasAccess(['ADMIN', 'MANAGER', 'DRIVER'])) {
      fetchLocations(); // Drivers need locations for current location dropdown
    }
  }, []);

  // --- HELPER RBAC & API ---
  const hasAccess = (allowedRoles) => allowedRoles.includes(user.role);

  const apiCall = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          throw new Error('Session expired. Please login again.');
        }
        const errorText = await response.text();
        throw new Error(`[Status ${response.status}] ${errorText.substring(0, 100)}...`);
      }
      return true;
    } catch (e) {
      toast.error(`Operasi Gagal: ${e.message}`);
      return false;
    }
  };

  // State Modal Delete
  const [deleteModal, setDeleteModal] = useState({ show: false, message: '', onConfirm: null });

  // --- HELPER CONFIRM DELETE ---
  const confirmDelete = (message, onConfirm) => {
    setDeleteModal({ show: true, message, onConfirm });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, message: '', onConfirm: null });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.onConfirm) deleteModal.onConfirm();
    closeDeleteModal();
  };

  // --- HANDLERS (CRUD) ---

  // 1. PENGIRIMAN (Shipments)
  const handleCreateShipment = async (data) => {
    // Transformasi data untuk backend
    const payload = {
      ...data,
      id: `SHP-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-generate ID
      customer: { name: data.customer }, // Fix: Structure as object
      origin: data.origin,
      destination: data.destination,
      weight: 1000, // Default weight
      type: data.type,
      estimatedDelivery: new Date(data.eta), // Convert to Date object
      fleet: vehicles.find(v => v.id === data.fleetId) // Kirim object fleet lengkap
    };

    if (await apiCall(`${API_BASE_URL}/shipments`, 'POST', payload)) {
      toast.success('Pengiriman berhasil dibuat!');
      fetchShipments();
      fetchVehicles(); // Refresh vehicles as fleet status might change
    }
  };

  const handleUpdateShipment = async (id, data) => {
    const payload = {
      ...data,
      customer: { name: data.customer }, // Fix: Structure as object
      origin: data.origin,
      destination: data.destination,
      type: data.type,
      estimatedDelivery: new Date(data.eta),
      fleet: vehicles.find(v => v.id === data.fleetId)
    };

    if (await apiCall(`${API_BASE_URL}/shipments/${id}`, 'PUT', payload)) {
      toast.success('Pengiriman berhasil diperbarui!');
      fetchShipments();
      fetchVehicles(); // Refresh vehicles as fleet status might change
    }
  };

  const handleDeleteShipment = (id) => {
    confirmDelete("Hapus pengiriman ini?", async () => {
      await fetch(`${API_BASE_URL}/shipments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setShipments(shipments.filter(s => s.id !== id));
      fetchVehicles(); // Refresh armada (mungkin jadi Available kembali)
      toast.success('Pengiriman berhasil dihapus');
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('logistic_token');
      const response = await fetch(`${API_BASE_URL}/shipments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${token}`
        },
        body: newStatus
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      toast.success(`Status diperbarui menjadi ${newStatus}`);
      fetchShipments();
      fetchVehicles(); // Refresh armada saat status kiriman berubah
    } catch (e) {
      toast.error(`Gagal update status: ${e.message}`);
      console.error('Status update error:', e);
    }
  };

  const handleConfirmDelivery = async (id, notes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}/confirm-delivery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        toast.success('Pengiriman berhasil dikonfirmasi!');
        fetchShipments();
        fetchVehicles(); // Refresh vehicles as status changes
      } else {
        const error = await response.json();
        toast.error(error.message || 'Gagal konfirmasi pengiriman');
      }
    } catch (e) {
      toast.error('Gagal konfirmasi pengiriman: Cek koneksi server');
    }
  };

  // 2. ARMADA (Fleet)
  const handleCreateVehicle = async (data) => {
    const payload = {
      ...data,
      id: `FLT-${Math.floor(100 + Math.random() * 900)}`, // Auto-generate ID
      capacity: data.type === 'Truck' ? 5000 : 1000, // Default capacity
      driver: data.driverName || data.driver, // Use driverName or driver field
      driverId: data.driverId, // Pass driverId if selected from dropdown
      fuelType: 'Diesel', // Default
      year: 2023 // Default
    };
    if (await apiCall(`${API_BASE_URL}/fleet`, 'POST', payload)) {
      toast.success('Armada berhasil ditambahkan!');
      fetchVehicles();
      fetchDrivers(); // Refresh drivers availability
    }
  };

  const handleUpdateVehicle = async (id, data) => {
    const payload = {
      ...data,
      capacity: data.type === 'Truck' ? 5000 : 1000,
      driver: data.driverName || data.driver,
      driverId: data.driverId, // Pass driverId if changed
      fuelType: 'Diesel',
      year: 2023
    };
    if (await apiCall(`${API_BASE_URL}/fleet/${id}`, 'PUT', payload)) {
      toast.success('Data armada diperbarui!');
      fetchVehicles();
      fetchDrivers(); // Refresh drivers availability
    }
  };
  const handleDeleteVehicle = (id) => {
    confirmDelete("Hapus armada ini?", async () => {
      await fetch(`${API_BASE_URL}/fleet/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Armada berhasil dihapus');
    });
  };

  // 3. PELANGGAN (Customers)
  const handleCreateCustomer = async (data) => {
    const customerData = {
      ...data,
      id: `CUST-${Math.floor(100 + Math.random() * 900)}` // Auto-generate ID
    };
    if (await apiCall(`${API_BASE_URL}/customers`, 'POST', customerData)) {
      toast.success('Pelanggan berhasil ditambahkan!');
      fetchCustomers();
    }
  };
  const handleUpdateCustomer = async (id, data) => {
    if (await apiCall(`${API_BASE_URL}/customers/${id}`, 'PUT', data)) {
      toast.success('Data pelanggan diperbarui!');
      fetchCustomers();
    }
  };
  const handleDeleteCustomer = (id) => {
    confirmDelete("Hapus pelanggan ini?", async () => {
      await fetch(`${API_BASE_URL}/customers/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      setCustomers(customers.filter(c => c.id !== id));
      toast.success('Pelanggan berhasil dihapus');
    });
  };

  // 4. PENGGUNA (Users)
  const handleCreateUser = async (data) => {
    if (await apiCall(`${API_BASE_URL}/users`, 'POST', data)) {
      toast.success('Pengguna berhasil dibuat!');
      fetchAppUsers();
    }
  };
  const handleUpdateUser = async (id, data) => {
    if (await apiCall(`${API_BASE_URL}/users/${id}`, 'PUT', data)) {
      toast.success('Data pengguna diperbarui!');
      fetchAppUsers();
    }
  };
  const handleDeleteUser = (id) => {
    confirmDelete("Hapus pengguna sistem ini?", async () => {
      await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setAppUsers(appUsers.filter(u => (u._id || u.id) !== id));
      toast.success('Pengguna berhasil dihapus');
    });
  };

  // 5. LOKASI (Locations)
  const handleCreateLocation = async (data) => {
    const payload = {
      ...data,
      id: `LOC-${Math.floor(100 + Math.random() * 900)}`,
      name: data.cityName,
      type: 'Warehouse',
      address: `${data.cityName}, Indonesia`,
      coordinates: { lat: data.latitude, lng: data.longitude },
      latitude: data.latitude,
      longitude: data.longitude,
      capacity: 10000,
      currentOccupancy: 0,
      manager: 'System Admin'
    };

    if (await apiCall(`${API_BASE_URL}/locations`, 'POST', payload)) {
      toast.success('Lokasi berhasil ditambahkan!');
      fetchLocations();
    }
  };

  const handleUpdateLocation = async (id, data) => {
    const payload = {
      ...data,
      name: data.cityName,
      type: 'Warehouse',
      address: `${data.cityName}, Indonesia`,
      coordinates: { lat: data.latitude, lng: data.longitude },
      latitude: data.latitude,
      longitude: data.longitude,
      capacity: 10000,
      currentOccupancy: 0,
      manager: 'System Admin'
    };

    if (await apiCall(`${API_BASE_URL}/locations/${id}`, 'PUT', payload)) {
      toast.success('Lokasi berhasil diperbarui!');
      fetchLocations();
    }
  };

  const handleDeleteLocation = (id) => {
    confirmDelete("Hapus lokasi ini?", async () => {
      await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setLocations(locations.filter(l => l.id !== id));
      toast.success('Lokasi berhasil dihapus');
    });
  };

  // --- LOGIKA FILTER & JUDUL ---
  const filteredShipments = shipments.filter(s => {
    const matchesSearch = (s.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (s.customer?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (s.status === 'Pending' || s.status === 'In Transit')) ||
      s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPageTitle = (path) => {
    if (path.includes('/dashboard')) return 'Ringkasan Dashboard';
    if (path.includes('/shipments')) return 'Manajemen Pengiriman';
    if (path.includes('/fleet')) return 'Status Armada';
    if (path.includes('/customers')) return 'Manajemen Pelanggan';
    if (path.includes('/users')) return 'Manajemen Pengguna';
    if (path.includes('/locations')) return 'Manajemen Lokasi';
    if (path.includes('/settings')) return 'Pengaturan Akun';
    if (path.includes('/analytics')) return 'Analisis AI';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Modal Konfirmasi Hapus */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full mx-4 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
                <p className="text-slate-500 mt-1">{deleteModal.message}</p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 transition-all">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-3 text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-96">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari pengiriman, armada, atau pelanggan..."
              className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{getPageTitle(location.pathname)}</h2>
            {error && <div className="text-red-500 text-sm mt-1 font-medium flex items-center gap-2"><AlertTriangle size={14} /> {error}</div>}
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={<DashboardView
              shipments={shipments}
              vehicles={vehicles}
              locations={locations} // Data Lokasi dikirim ke Dashboard untuk Peta
            />} />

            <Route path="/shipments" element={
              hasAccess(['ADMIN', 'MANAGER', 'STAFF', 'DRIVER'])
                ? <ShipmentListView
                  user={user}
                  shipments={filteredShipments}
                  customers={customers}
                  locations={locations}
                  vehicles={vehicles}
                  onDelete={handleDeleteShipment}
                  onStatusChange={handleStatusChange}
                  onCreate={handleCreateShipment}
                  onUpdate={handleUpdateShipment}
                  onConfirmDelivery={handleConfirmDelivery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                />
                : <Navigate to="/dashboard" />
            } />

            <Route path="/fleet" element={
              hasAccess(['ADMIN', 'MANAGER', 'DRIVER'])
                ? <FleetGridView user={user} vehicles={vehicles} drivers={drivers} locations={locations} shipments={shipments} onStatusChange={handleStatusChange} onCreate={handleCreateVehicle} onUpdate={handleUpdateVehicle} onDelete={handleDeleteVehicle} />
                : <Navigate to="/dashboard" />
            } />

            <Route path="/customers" element={
              hasAccess(['ADMIN', 'MANAGER', 'STAFF'])
                ? <CustomerListView customers={customers} onCreate={handleCreateCustomer} onUpdate={handleUpdateCustomer} onDelete={handleDeleteCustomer} />
                : <Navigate to="/dashboard" />
            } />

            <Route path="/users" element={
              hasAccess(['ADMIN'])
                ? <UserListView users={appUsers} onCreate={handleCreateUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
                : <Navigate to="/dashboard" />
            } />

            <Route path="/locations" element={
              hasAccess(['ADMIN', 'MANAGER'])
                ? <LocationListView locations={locations} onCreate={handleCreateLocation} onUpdate={handleUpdateLocation} onDelete={handleDeleteLocation} />
                : <Navigate to="/dashboard" />
            } />

            <Route path="/settings" element={<SettingsView user={user} onUpdateSession={onUpdateSession} />} />

            <Route path="/activity-logs" element={
              hasAccess(['ADMIN', 'MANAGER'])
                ? <ActivityLogView />
                : <Navigate to="/dashboard" />
            } />

            <Route path="/analytics" element={
              hasAccess(['ADMIN', 'MANAGER'])
                ? <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
                  <BrainCircuit className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">Modul Analisis AI</h3>
                  <p className="text-slate-500">Hubungkan Kunci API Gemini untuk mengaktifkan saran optimasi rute.</p>
                </div>
                : <Navigate to="/dashboard" />
            } />

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
