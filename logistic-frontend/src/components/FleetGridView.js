import React, { useState } from 'react';
import { CheckCircle, Navigation, Wrench, Truck, Battery, Plus, Edit2, Trash2, Save } from 'lucide-react';

const FleetGridView = ({ user, vehicles, drivers = [], locations = [], shipments = [], onStatusChange, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState = {
    id: '',
    plateNumber: '',
    driverId: '',
    driverName: '',
    type: 'Truck',
    status: 'Available',
    fuelLevel: 100,
    currentLocation: 'Depot'
  };

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEditClick = (vehicle) => {
    setFormData({
      ...vehicle,
      driverId: vehicle.driverId || '',
      driverName: vehicle.driver || ''
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDriverChange = (e) => {
    const selectedDriverId = e.target.value;

    if (selectedDriverId) {
      const selectedDriver = drivers.find(d => d._id === selectedDriverId);
      if (selectedDriver) {
        setFormData({
          ...formData,
          driverId: selectedDriverId,
          driverName: selectedDriver.fullName,
          driver: selectedDriver.fullName
        });
      }
    } else {
      setFormData({
        ...formData,
        driverId: '',
        driverName: '',
        driver: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Locations available:', locations); // Debug log
    if (isEditing) {
      onUpdate(formData.id, formData);
    } else {
      onCreate(formData);
    }
    resetForm();
  };

  const getStatusBadge = (status) => {
    // Backend menggunakan Bahasa Inggris, UI menggunakan Bahasa Indonesia
    switch (status) {
      case 'Available': return <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Tersedia</span>;
      case 'On Route': return <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full"><Navigation className="w-3 h-3" /> Jalan</span>;
      case 'Maintenance': return <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full"><Wrench className="w-3 h-3" /> Perbaikan</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Manajemen Armada</h2>
        {/* Hanya tampilkan tombol tambah untuk ADMIN/MANAGER */}
        {user.role !== 'DRIVER' && (
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <Plus size={16} />
            {showForm && !isEditing ? 'Batal' : 'Tambah Armada'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">{isEditing ? `Edit Armada ${formData.id}` : 'Armada Baru'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm">Batal</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isEditing && (
              <div className="md:col-span-3 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-xs text-slate-500">ID Armada: </span>
                <span className="text-sm font-medium text-slate-700">{formData.id}</span>
              </div>
            )}
            <input required placeholder="Plat Nomor" className="border p-2 rounded" value={formData.plateNumber} onChange={e => setFormData({ ...formData, plateNumber: e.target.value })} />

            {/* Dropdown Driver - Hanya untuk ADMIN/MANAGER */}
            {user.role !== 'DRIVER' ? (
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">Pengemudi</label>
                <select
                  className="border p-2 rounded bg-white"
                  value={formData.driverId || ''}
                  onChange={handleDriverChange}
                >
                  <option value="">-- Pilih Driver --</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.fullName} {driver.hasAssignedFleet ? '(Sudah Ditugaskan)' : '(Tersedia)'}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                placeholder="Nama Pengemudi"
                className="border p-2 rounded bg-slate-100"
                value={formData.driverName}
                readOnly
                disabled
              />
            )}

            <select className="border p-2 rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="Truck">Truk</option>
              <option value="Van">Mobil Box</option>
              <option value="Drone">Drone</option>
            </select>
            <select
              className="border p-2 rounded"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Available">Tersedia</option>
              <option value="On Route">Dalam Perjalanan</option>
              <option value="Maintenance">Perbaikan</option>
            </select>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Lokasi Saat Ini</label>
              <select
                required
                className="border p-2 rounded bg-white"
                value={formData.currentLocation}
                onChange={e => setFormData({ ...formData, currentLocation: e.target.value })}
              >
                <option value="">-- Pilih Lokasi --</option>
                {locations && locations.length > 0 ? (
                  locations.map((loc) => (
                    <option key={loc.id} value={loc.cityName}>
                      {loc.cityName}
                    </option>
                  ))
                ) : (
                  <option disabled>Tidak ada lokasi tersedia</option>
                )}
              </select>
              {(!locations || locations.length === 0) && (
                <span className="text-xs text-red-500 mt-1">⚠️ Data lokasi belum dimuat</span>
              )}
            </div>

            <div className="md:col-span-3 flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Bahan Bakar: {formData.fuelLevel}%</label>
                <input type="range" min="0" max="100" className="w-full accent-blue-600" value={formData.fuelLevel} onChange={e => setFormData({ ...formData, fuelLevel: parseInt(e.target.value) })} />
              </div>
            </div>

            <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 md:col-span-3 flex justify-center items-center gap-2">
              <Save size={16} />
              {isEditing ? 'Perbarui Armada' : 'Simpan Armada'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow relative group">

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm">
              <button onClick={() => handleEditClick(vehicle)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 size={14} /></button>
              {/* Hanya ADMIN/MANAGER bisa hapus armada */}
              {user.role !== 'DRIVER' && (
                <button onClick={() => onDelete(vehicle.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button>
              )}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${vehicle.status === 'Maintenance' ? 'bg-amber-50' : 'bg-slate-100'}`}>
                  <Truck className={`w-6 h-6 ${vehicle.status === 'Maintenance' ? 'text-amber-600' : 'text-slate-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{vehicle.plateNumber}</h3>
                  <p className="text-sm text-slate-500">{vehicle.type} • {vehicle.id}</p>
                </div>
              </div>
              {getStatusBadge(vehicle.status)}
            </div>
            <div className="space-y-3">
              {/* Tampilkan ID Pengiriman jika ada */}
              {(() => {
                const assignedShipment = shipments.find(s => s.fleet?.id === vehicle.id);
                return assignedShipment && (
                  <>
                    <div className="flex justify-between items-center text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      <span className="text-blue-600 font-medium">ID Pengiriman</span>
                      <span className="font-bold text-blue-700">{assignedShipment.id}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Asal</span>
                      <span className="font-medium text-slate-900">{assignedShipment.origin}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Tujuan</span>
                      <span className="font-medium text-slate-900">{assignedShipment.destination}</span>
                    </div>
                  </>
                );
              })()}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Battery className="w-3 h-3" /> BBM</span>
                  <span className="text-xs font-medium text-slate-700">{vehicle.fuelLevel}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${vehicle.fuelLevel < 20 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${vehicle.fuelLevel}%` }}></div>
                </div>
              </div>

              {/* Tombol Status untuk Driver - Update Shipment Status */}
              {user.role === 'DRIVER' && (() => {
                // Find shipment assigned to this fleet
                const assignedShipment = shipments.find(s => s.fleet?.id === vehicle.id);

                if (!assignedShipment) {
                  return (
                    <div className="pt-4 border-t border-slate-100 mt-4">
                      <p className="text-xs text-slate-400 italic text-center">Tidak ada pengiriman aktif</p>
                    </div>
                  );
                }

                return (
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <p className="text-xs text-slate-500 mb-2">Ubah Status Pengiriman:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onStatusChange(assignedShipment.id, 'Delivered')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${assignedShipment.status === 'Delivered'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        disabled={assignedShipment.status === 'Delivered' || assignedShipment.status === 'Cancelled'}
                      >
                        Sampai Tujuan
                      </button>
                      <button
                        onClick={() => onStatusChange(assignedShipment.id, 'In Transit')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${assignedShipment.status === 'In Transit'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        disabled={assignedShipment.status === 'Delivered' || assignedShipment.status === 'Cancelled'}
                      >
                        Dalam Perjalanan
                      </button>
                      <button
                        onClick={() => onStatusChange(assignedShipment.id, 'Pending')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${assignedShipment.status === 'Pending'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        disabled={assignedShipment.status === 'Delivered' || assignedShipment.status === 'Cancelled'}
                      >
                        Menunggu
                      </button>
                      <button
                        onClick={() => onStatusChange(assignedShipment.id, 'Cancelled')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${assignedShipment.status === 'Cancelled'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        disabled={assignedShipment.status === 'Delivered' || assignedShipment.status === 'Cancelled'}
                      >
                        Dibatalkan
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            Tidak ada armada ditemukan. Tambahkan armada baru untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetGridView;
