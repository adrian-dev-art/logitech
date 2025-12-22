import React, { useState } from 'react';
import { Package, MapPin, Clock, Trash2, Truck, Printer, FileSpreadsheet, Download, Edit2 } from 'lucide-react'; // Tambah Icon

const ShipmentListView = ({ user, shipments, customers, locations, vehicles, onDelete, onStatusChange, onCreate, onUpdate, onConfirmDelivery, statusFilter, onStatusFilterChange }) => {
  const [newShipment, setNewShipment] = useState({
    customer: '',
    fleetId: '',
    origin: '',
    destination: '',
    type: 'General',
    eta: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdate(editingId, newShipment);
      setIsEditing(false);
      setEditingId(null);
    } else {
      onCreate(newShipment);
    }
    setNewShipment({ customer: '', fleetId: '', origin: '', destination: '', type: 'General', eta: '' });
    setShowForm(false);
  };

  const handleEdit = (shipment) => {
    setNewShipment({
      customer: shipment.customer?.name || '',
      fleetId: shipment.fleet?.id || '',
      origin: shipment.origin,
      destination: shipment.destination,
      type: shipment.type || 'General',
      eta: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
    setEditingId(shipment.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewShipment({ customer: '', fleetId: '', origin: '', destination: '', type: 'General', eta: '' });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  // --- FUNGSI EXPORT KE CSV (EXCEL) ---
  const handleExport = () => {
    // 1. Tentukan Header Kolom
    const headers = ["ID Pengiriman", "Pelanggan", "Tipe Kargo", "Asal", "Tujuan", "Armada", "Supir", "Status", "Estimasi Tiba"];

    // 2. Format Data Baris
    const rows = shipments.map(s => [
      s.id,
      s.customer?.name || '-',
      s.type,
      s.origin,
      s.destination,
      s.fleet ? s.fleet.plateNumber : 'Belum Ada',
      s.fleet ? s.fleet.driver : '-',
      s.status,
      s.eta
    ]);

    // 3. Gabungkan Header dan Rows menjadi string CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // 4. Buat Blob dan Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Pengiriman_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNGSI CETAK SURAT JALAN (YANG SUDAH ADA) ---
  const handlePrint = (shipment) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const htmlContent = `
      <html>
        <head>
          <title>Surat Jalan - ${shipment.id}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .company-name { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .doc-title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; text-decoration: underline; }
            .info-table { width: 100%; margin-bottom: 20px; }
            .info-table td { padding: 5px; vertical-align: top; }
            .label { font-weight: bold; width: 120px; }
            .content-box { border: 1px solid #000; padding: 15px; margin-bottom: 20px; }
            .route-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .route-table th, .route-table td { border: 1px solid #000; padding: 8px; text-align: left; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
            .signature-box { margin-top: 60px; border-top: 1px solid #000; width: 150px; margin-left: auto; margin-right: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">LOGITECH INDONESIA</div>
            <div>Jl. Logistik Raya No. 88, Jakarta Selatan, Indonesia</div>
            <div>Telp: (021) 555-9999 | Email: support@logitech.id</div>
          </div>
          <div class="doc-title">SURAT JALAN (DELIVERY ORDER)</div>
          <table class="info-table">
            <tr>
              <td class="label">No. Resi</td><td>: ${shipment.id}</td>
              <td class="label">Tanggal Cetak</td><td>: ${new Date().toLocaleDateString('id-ID')}</td>
            </tr>
            <tr>
              <td class="label">Pelanggan</td><td>: ${shipment.customer?.name || '-'}</td>
              <td class="label">Jenis Layanan</td><td>: Reguler</td>
            </tr>
          </table>
          <div class="content-box">
            <strong>Detail Pengangkutan:</strong>
            <table class="route-table">
              <thead><tr><th>Asal</th><th>Tujuan</th><th>Tipe Kargo</th><th>Estimasi Tiba</th></tr></thead>
              <tbody><tr><td>${shipment.origin}</td><td>${shipment.destination}</td><td>${shipment.type || 'General'}</td><td>${shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString('id-ID') : '-'}</td></tr></tbody>
            </table>
          </div>
          <div class="content-box">
            <strong>Info Armada:</strong><br/>
            ${shipment.fleet ? `Kendaraan: ${shipment.fleet.type} | Plat: ${shipment.fleet.plateNumber} | Driver: ${shipment.fleet.driver || 'No Driver'}` : 'Belum ada armada ditugaskan'}
          </div>
          <div class="footer">
            <div style="width: 30%;"><div>Pengirim</div><div class="signature-box"></div></div>
            <div style="width: 30%;"><div>Pengemudi</div><div class="signature-box"></div></div>
            <div style="width: 30%;"><div>Penerima</div><div class="signature-box"></div></div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Manajemen Pengiriman</h2>

        <div className="flex items-center gap-3">
          {/* Hanya Admin/Manager/Staff bisa export dan tambah pengiriman */}
          {user.role !== 'DRIVER' && (
            <>
              {/* Tombol Export Excel */}
              <button
                onClick={handleExport}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium text-sm"
                title="Unduh Laporan CSV"
              >
                <FileSpreadsheet size={16} />
                Export Laporan
              </button>

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Package size={16} />
                {showForm ? 'Batal' : 'Tambah Pengiriman'}
              </button>
            </>
          )}

          <select
            className="border p-2 rounded w-44 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif (Dalam Proses)</option>
            <option value="Pending">Menunggu Penugasan</option>
            <option value="In Transit">Dalam Perjalanan</option>
            <option value="Delivered">Terkirim</option>
            <option value="Cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">
              {isEditing ? `Edit Pengiriman ${editingId}` : 'Pengiriman Baru'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm">Batal</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Pelanggan</label>
              <select required className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={newShipment.customer} onChange={e => setNewShipment({ ...newShipment, customer: e.target.value })}>
                <option value="">-- Pilih Pelanggan --</option>
                {customers && customers.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Tipe Kargo</label>
              <select className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={newShipment.type} onChange={e => setNewShipment({ ...newShipment, type: e.target.value })}>
                <option value="General">Umum</option>
                <option value="Electronics">Elektronik</option>
                <option value="Perishable">Mudah Rusak</option>
                <option value="Fragile">Barang Pecah Belah</option>
                <option value="Food">Makanan</option>
                <option value="Furniture">Mebel</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Kota Asal</label>
              <select required className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={newShipment.origin} onChange={e => setNewShipment({ ...newShipment, origin: e.target.value })}>
                <option value="">-- Pilih Kota Asal --</option>
                {locations && locations.map((loc) => (<option key={loc.id} value={loc.cityName}>{loc.cityName}</option>))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Kota Tujuan</label>
              <select required className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={newShipment.destination} onChange={e => setNewShipment({ ...newShipment, destination: e.target.value })}>
                <option value="">-- Pilih Kota Tujuan --</option>
                {locations && locations.map((loc) => (<option key={loc.id} value={loc.cityName}>{loc.cityName}</option>))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Tugaskan Armada (Opsional)</label>
              <select className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={newShipment.fleetId} onChange={e => setNewShipment({ ...newShipment, fleetId: e.target.value })}>
                <option value="">-- Belum Ditugaskan --</option>
                {vehicles && vehicles.filter(v => {
                  // Saat edit, tampilkan armada yang Available ATAU armada yang sedang assigned
                  if (isEditing && newShipment.fleetId && v.id === newShipment.fleetId) {
                    return true; // Selalu tampilkan armada yang sedang di-assign
                  }
                  return v.status === 'Available'; // Tampilkan yang Available
                }).map((v) => (
                  <option key={v.id} value={v.id}>{v.plateNumber} ({v.type}) - {v.driver || 'No Driver'}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Estimasi Tiba</label>
              <input required type="date" className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" value={newShipment.eta} onChange={e => setNewShipment({ ...newShipment, eta: e.target.value })} />
            </div>

            <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 md:col-span-2 md:w-1/4 md:justify-self-end mt-4 shadow-sm font-medium">
              {isEditing ? 'Update Data' : 'Simpan Data'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Armada</th>
                <th className="px-6 py-4">Rute</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{shipment.id}</td>
                  <td className="px-6 py-4 text-slate-600">{shipment.customer?.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {shipment.fleet ? (
                      <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                        <Truck size={12} className="text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{shipment.fleet.plateNumber}</span>
                          <span className="text-[10px] text-slate-400">{shipment.fleet.driver}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belum ditugaskan</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {shipment.origin} <span className="text-slate-300">→</span> {shipment.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {/* Driver hanya bisa konfirmasi, tidak bisa ubah status manual */}
                    {user.role === 'DRIVER' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status === 'Pending' ? 'Menunggu' :
                          shipment.status === 'In Transit' ? 'Dalam Perjalanan' :
                            shipment.status === 'Delivered' ? 'Terkirim' : 'Dibatalkan'}
                      </span>
                    ) : (
                      <select
                        value={shipment.status}
                        onChange={(e) => onStatusChange(shipment.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(shipment.status)}`}
                      >
                        <option value="Pending">Menunggu</option>
                        <option value="In Transit">Dalam Perjalanan</option>
                        <option value="Delivered">Terkirim</option>
                        <option value="Cancelled">Dibatalkan</option>
                      </select>
                    )}

                    {/* Tampilkan badge konfirmasi jika sudah dikonfirmasi */}
                    {shipment.deliveryConfirmation?.confirmed && (
                      <div className="mt-1">
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Dikonfirmasi
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Tombol Konfirmasi Pengiriman untuk Driver */}
                      {user.role === 'DRIVER' && shipment.status === 'In Transit' && shipment.fleet && !shipment.deliveryConfirmation?.confirmed && (
                        <button
                          onClick={() => onConfirmDelivery(shipment.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-medium border border-emerald-200"
                          title="Konfirmasi Pengiriman Sampai"
                        >
                          ✓ Konfirmasi
                        </button>
                      )}

                      {/* Tombol Status untuk Driver - Sampai Tujuan & Dibatalkan */}
                      {user.role === 'DRIVER' && shipment.fleet && (
                        <div className="flex gap-2">
                          {/* Tombol Sampai Tujuan - hanya muncul jika status In Transit */}
                          {shipment.status === 'In Transit' && (
                            <button
                              onClick={() => onStatusChange(shipment.id, 'Delivered')}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs font-medium"
                              title="Tandai Sampai Tujuan"
                            >
                              Sampai Tujuan
                            </button>
                          )}

                          {/* Tombol Dibatalkan - hanya muncul jika belum Delivered atau Cancelled */}
                          {(shipment.status === 'Pending' || shipment.status === 'In Transit') && (
                            <button
                              onClick={() => onStatusChange(shipment.id, 'Cancelled')}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                              title="Batalkan Pengiriman"
                            >
                              Dibatalkan
                            </button>
                          )}
                        </div>
                      )}

                      {/* Tombol Edit/Print/Delete untuk Non-Driver */}
                      {user.role !== 'DRIVER' && (
                        <>
                          <button
                            onClick={() => handleEdit(shipment)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Pengiriman"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handlePrint(shipment)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Cetak Surat Jalan"
                          >
                            <Printer size={16} />
                          </button>
                          <button onClick={() => onDelete(shipment.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && <div className="p-8 text-center text-slate-500">Tidak ada data pengiriman ditemukan.</div>}
        </div>
      </div>
    </div>
  );
};

export default ShipmentListView;
