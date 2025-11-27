import React, { useEffect } from 'react';
import { Package, Truck, CheckCircle, BarChart3, Map as MapIcon, PieChart as PieIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet'; // Tambah 'Tooltip' dan 'useMap'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- KONFIGURASI LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- KOMPONEN AUTO-ZOOM PETA ---
// Komponen kecil ini bertugas mengatur zoom peta agar memuat semua rute
const MapBounds = ({ shipments, getCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!shipments || shipments.length === 0) return;

    const bounds = L.latLngBounds();
    let hasValidCoords = false;

    shipments.forEach(s => {
      const start = getCoords(s.origin);
      const end = getCoords(s.destination);

      // Validasi sederhana (jangan masukkan default Jakarta jika bukan datanya)
      if (start) bounds.extend(start);
      if (end) bounds.extend(end);
      hasValidCoords = true;
    });

    if (hasValidCoords && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Beri jarak pinggir (padding)
    }
  }, [shipments, map, getCoords]);

  return null;
};

const DashboardView = ({ shipments, vehicles, locations }) => {
  // --- 1. PERHITUNGAN METRIK NYATA ---
  const totalShipments = shipments.length;
  const totalVehicles = vehicles.length;

  const activeShipments = shipments.filter(s => s.status === 'In Transit');
  const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length;
  const pendingShipments = shipments.filter(s => s.status === 'Pending').length;
  const cancelledShipments = shipments.filter(s => s.status === 'Cancelled').length;

  const onRouteVehicles = vehicles.filter(v => v.status === 'On Route').length;

  const completionRate = totalShipments > 0
    ? ((deliveredShipments / totalShipments) * 100).toFixed(1)
    : 0;

  const fleetUtilization = totalVehicles > 0
    ? ((onRouteVehicles / totalVehicles) * 100).toFixed(1)
    : 0;

  // --- 2. PERSIAPAN DATA GRAFIK ---
  const statusData = [
    { name: 'Jalan', value: activeShipments.length },
    { name: 'Selesai', value: deliveredShipments },
    { name: 'Menunggu', value: pendingShipments },
    { name: 'Batal', value: cancelledShipments },
  ].filter(item => item.value > 0);

  const typeCounts = shipments.reduce((acc, curr) => {
    const type = curr.type || 'Lainnya';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(typeCounts).map(key => ({
    name: key,
    jumlah: typeCounts[key]
  }));

  // --- 3. HELPER PETA ---
  const getCoords = (cityName) => {
    if (!locations || locations.length === 0) return [-6.2088, 106.8456];
    if (!cityName) return [-6.2088, 106.8456]; // Handle undefined/null cityName

    // Pencarian Case-Insensitive agar lebih fleksibel
    const loc = locations.find(l => l.cityName?.toLowerCase() === cityName.toLowerCase());
    return loc ? [loc.latitude, loc.longitude] : [-6.2088, 106.8456];
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pesanan</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalShipments}</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Armada Berjalan</p>
            <h3 className="text-2xl font-bold text-slate-900">{onRouteVehicles} <span className="text-sm text-slate-400 font-normal">/ {totalVehicles}</span></h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Truck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Rasio Selesai</p>
            <h3 className="text-2xl font-bold text-slate-900">{completionRate}%</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Utilisasi Armada</p>
            <h3 className="text-2xl font-bold text-slate-900">{fleetUtilization}%</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-full text-amber-600">
            <BarChart3 size={24} />
          </div>
        </div>
      </div>

      {/* --- PETA INTERAKTIF (LEAFLET) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MapIcon size={18} className="text-blue-600" />
            Pemantauan Rute Aktif ({activeShipments.length})
          </h3>
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border">Live Map</span>
        </div>
        <div className="h-96 w-full relative z-0">
          <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Komponen Auto-Zoom */}
            <MapBounds shipments={activeShipments} getCoords={getCoords} />

            {/* Render Rute */}
            {activeShipments.map((shipment) => {
              const start = getCoords(shipment.origin);
              const end = getCoords(shipment.destination);

              // Skip jika koordinat tidak valid
              if (start[0] === end[0] && start[1] === end[1]) return null;

              return (
                <React.Fragment key={shipment.id}>
                  {/* Marker Asal (Origin) */}
                  <Marker position={start}>
                    <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                      Asal: {shipment.origin}
                    </Tooltip>
                    <Popup>
                      <div className="text-sm">
                        <strong className="block text-blue-600 mb-1">Titik Asal</strong>
                        <p>Kota: {shipment.origin}</p>
                        <p>ID: {shipment.id}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Marker Tujuan (Destination) */}
                  <Marker position={end}>
                    <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                      Tujuan: {shipment.destination}
                    </Tooltip>
                    <Popup>
                      <div className="text-sm">
                        <strong className="block text-red-600 mb-1">Titik Tujuan</strong>
                        <p>Kota: {shipment.destination}</p>
                        <p>Penerima: {shipment.customer?.name}</p>
                        <p>Estimasi: {shipment.eta}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Garis Rute (Polyline) dengan Tooltip */}
                  <Polyline
                    positions={[start, end]}
                    color="#3b82f6"
                    dashArray="10, 10"
                    weight={4}
                    opacity={0.7}
                  >
                    <Popup>
                      <div className="text-center text-xs font-medium">
                        Rute: {shipment.id}<br />
                        {shipment.origin} ➝ {shipment.destination}
                      </div>
                    </Popup>
                  </Polyline>
                </React.Fragment>
              )
            })}
          </MapContainer>
        </div>
      </div>

      {/* --- GRAFIK ANALITIK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* GRAFIK 1: Kategori Barang */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package size={18} className="text-slate-400" /> Kategori Barang
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="jumlah" fill="#6366f1" radius={[4, 4, 0, 0]} name="Jumlah Pesanan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAFIK 2: Status Pengiriman */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <PieIcon size={18} className="text-slate-400" /> Status Pengiriman
            </h3>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;
