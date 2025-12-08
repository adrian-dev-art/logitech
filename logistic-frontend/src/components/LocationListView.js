import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Save, Search, Edit2 } from 'lucide-react'; // Tambah icon Edit2
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'; // Tambah useMap
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FIX ICON LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- KOMPONEN: Menggeser Peta Secara Programatik ---
// Ini diperlukan agar peta bisa "terbang" ke lokasi hasil pencarian
const MapController = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13, {
        duration: 2
      });
    }
  }, [coords, map]);
  return null;
};

// --- KOMPONEN MARKER (Klik Peta) ---
const LocationMarker = ({ position, setPosition, setFormData }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setFormData(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      }));
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Lokasi Terpilih</Popup>
    </Marker>
  );
};

const LocationListView = ({ locations, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    cityName: '',
    latitude: '',
    longitude: ''
  });

  // State untuk Peta
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(null); // State untuk memicu pergerakan peta
  const [isSearching, setIsSearching] = useState(false);

  const resetForm = () => {
    setFormData({ cityName: '', latitude: '', longitude: '' });
    setMarkerPosition(null);
    setSearchQuery('');
    setMapCenter(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (location) => {
    setFormData({
      cityName: location.cityName,
      latitude: location.latitude,
      longitude: location.longitude
    });
    const position = { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) };
    setMarkerPosition(position);
    setMapCenter(position);
    setEditingId(location.id || location._id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onCreate(payload);
    }
    resetForm();
  };

  // --- FUNGSI PENCARIAN LOKASI (Nominatim API) ---
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsSearching(true);
    try {
      // Panggil API OpenStreetMap (Gratis)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        // 1. Update Form
        setFormData({
          cityName: display_name.split(',')[0], // Ambil nama depan saja
          latitude: newLat.toFixed(6),
          longitude: newLng.toFixed(6)
        });

        // 2. Update Marker & Peta
        const newPos = { lat: newLat, lng: newLng };
        setMarkerPosition(newPos);
        setMapCenter(newPos); // Memicu MapController
      } else {
        alert("Lokasi tidak ditemukan. Coba kata kunci lain.");
      }
    } catch (err) {
      console.error("Error searching location:", err);
      alert("Gagal mencari lokasi. Cek koneksi internet.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Manajemen Lokasi & Rute</h2>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm"
        >
          <Plus size={16} />
          {showForm && !editingId ? 'Batal' : editingId ? 'Batal Edit' : 'Tambah Lokasi'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">{editingId ? 'Edit Lokasi' : 'Pilih Lokasi Baru'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm">Batal</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BAGIAN KIRI: PETA INPUT */}
            <div className="flex flex-col gap-2">

              {/* Search Bar Peta */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cari lokasi (misal: Monas, Bandung)..."
                  className="flex-1 border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation(e)}
                />
                <button
                  onClick={handleSearchLocation}
                  disabled={isSearching}
                  className="bg-slate-800 text-white px-3 py-2 rounded hover:bg-slate-700 transition-colors flex items-center justify-center"
                >
                  {isSearching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search size={16} />}
                </button>
              </div>

              <div className="h-64 lg:h-80 rounded-lg overflow-hidden border border-slate-300 relative z-0">
                <MapContainer center={[-6.2088, 106.8456]} zoom={10} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    position={markerPosition}
                    setPosition={setMarkerPosition}
                    setFormData={setFormData}
                  />
                  {/* Komponen ini mengontrol pergerakan peta saat hasil search didapat */}
                  <MapController coords={mapCenter} />
                </MapContainer>

                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-xs rounded shadow z-[1000] text-slate-600">
                  Klik peta atau gunakan pencarian
                </div>
              </div>
            </div>

            {/* BAGIAN KANAN: FORM INPUT */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Nama Kota / Tempat</label>
                <input
                  required
                  placeholder="Contoh: Gudang Cikarang"
                  className="w-full border p-2 rounded"
                  value={formData.cityName}
                  onChange={e => setFormData({ ...formData, cityName: e.target.value })}
                />
                <p className="text-[10px] text-slate-400">Nama ini akan muncul di dropdown pengiriman.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Latitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    readOnly
                    placeholder="-"
                    className="w-full border p-2 rounded bg-slate-100 text-slate-600 cursor-not-allowed"
                    value={formData.latitude}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Longitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    readOnly
                    placeholder="-"
                    className="w-full border p-2 rounded bg-slate-100 text-slate-600 cursor-not-allowed"
                    value={formData.longitude}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm">
                  <Save size={16} />
                  {editingId ? 'Perbarui Lokasi' : 'Simpan Lokasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABEL LIST LOKASI */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Lokasi</th>
                <th className="px-6 py-4">Latitude</th>
                <th className="px-6 py-4">Longitude</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <MapPin size={14} />
                      </div>
                      {loc.cityName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                    {loc.latitude}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                    {loc.longitude}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(loc)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Lokasi"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(loc.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Lokasi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {locations.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada data lokasi.</div>}
        </div>
      </div>
    </div>
  );
};

export default LocationListView;
