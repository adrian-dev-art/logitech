import React from 'react';
import { LayoutDashboard, Package, Truck, BrainCircuit, Settings, LogOut, Box, Users, UserCog, MapPin, Activity } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Terima prop 'user' untuk pengecekan role
const Sidebar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = user?.role || 'STAFF'; // Default ke STAFF jika null

  // Definisi Menu beserta Hak Aksesnya
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['ADMIN', 'MANAGER', 'STAFF', 'DRIVER']
    },
    {
      path: '/shipments',
      label: 'Pengiriman',
      icon: Package,
      allowedRoles: ['ADMIN', 'MANAGER', 'STAFF']
    },
    {
      path: '/fleet',
      label: 'Armada',
      icon: Truck,
      allowedRoles: ['ADMIN', 'MANAGER', 'DRIVER']
    },
    {
      path: '/customers',
      label: 'Pelanggan',
      icon: Users,
      allowedRoles: ['ADMIN', 'MANAGER', 'STAFF']
    },
    {
      path: '/locations',
      label: 'Lokasi',
      icon: MapPin,
      allowedRoles: ['ADMIN', 'MANAGER']
    },
    {
      path: '/users',
      label: 'Pengguna',
      icon: UserCog,
      allowedRoles: ['ADMIN'] // Hanya Admin
    },
    {
      path: '/activity-logs',
      label: 'Log Aktivitas',
      icon: Activity,
      allowedRoles: ['ADMIN', 'MANAGER']
    },
    //    {
    //      path: '/analytics',
    //      label: 'Analisis AI',
    //      icon: BrainCircuit,
    //      allowedRoles: ['ADMIN', 'MANAGER']
    //    },
  ];

  // Filter menu berdasarkan Role user saat ini
  const filteredNavItems = navItems.filter(item => item.allowedRoles.includes(userRole));

  return (
    <div className="hidden md:flex w-64 bg-slate-900 text-white h-screen flex-col fixed left-0 top-0 shadow-xl z-30">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Box className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">LogiTech</h1>
          <p className="text-xs text-slate-400">Solusi Logistik</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <div className="px-4 py-2 mb-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Login sebagai: {userRole}
          </span>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/settings'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Pengaturan</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
