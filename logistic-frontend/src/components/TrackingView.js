import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, MapPin, Package } from 'lucide-react';

// Fix untuk ikon default Leaflet yang sering hilang di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Database Koordinat Kota (Hardcoded untuk demo)
const CITY_COORDINATES = {
  "Jakarta": [-6.2088, 106.8456],
  "Bandung": [-6.9175, 107.6191],
  "Surabaya": [-7.2575, 112.7521],
  "Semarang": [-6.9667, 110.4167],
  "Yogyakarta": [-7.7956, 110.3695],
  "Solo": [-7.5666, 110.8292],
  "Medan": [3.5952, 98.6722],
  "Bali": [-8.4095, 115.1889],
  "Lombok": [-8.6500, 116.3200],
  "Makassar": [-5.1477, 119.4327]
};

const TrackingView = ({ shipments }) => {
  // Filter hanya pengiriman yang sedang aktif (In Transit)
  const activeShipments = shipments.filter(s => s.status === 'In Transit');

  // Helper untuk mendapatkan koordinat dari string "Jakarta, ID" -> ambil "Jakarta"
  const getCoords = (cityName) => {
    const city = cityName.split(',')[0].trim();
    return CITY_COORDINATES[city] || [-6.2088, 106.8456]; // Default ke Jakarta jika tidak ketemu
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Pelacakan Langsung</h2>
            <p className="text-slate-500">Memantau {activeShipments.length} pengiriman aktif secara real-time</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
            Peta: OpenStreetMap
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BAGIAN PETA */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[500px] relative z-0">
          <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {activeShipments.map((shipment) => {
              const start = getCoords(shipment.origin);
              const end = getCoords(shipment.destination);

              return (
                <React.Fragment key={shipment.id}>
                  {/* Marker Asal */}
                  <Marker position={start}>
                    <Popup>
                      <b>Asal: {shipment.origin}</b><br/>
                      ID: {shipment.id}
                    </Popup>
                  </Marker>

                  {/* Marker Tujuan */}
                  <Marker position={end}>
                    <Popup>
                      <b>Tujuan: {shipment.destination}</b><br/>
                      Pelanggan: {shipment.customer?.name}
                    </Popup>
                  </Marker>

                  {/* Garis Rute */}
                  <Polyline positions={[start, end]} color="blue" dashArray="10, 10" weight={3} />
                </React.Fragment>
              )
            })}
          </MapContainer>
        </div>

        {/* SIDEBAR LIST PENGIRIMAN AKTIF */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto h-[500px]">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Truck size={20} className="text-blue-600" />
            Sedang Berjalan
          </h3>

          <div className="space-y-4">
            {activeShipments.length === 0 ? (
                <p className="text-slate-500 text-sm">Tidak ada pengiriman aktif saat ini.</p>
            ) : (
                activeShipments.map(shipment => (
                    <div key={shipment.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {shipment.id}
                            </span>
                            <span className="text-xs text-slate-400">{shipment.type}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                {shipment.origin}
                            </div>
                            <div className="ml-1 border-l border-dashed border-slate-300 h-4"></div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                {shipment.destination}
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                            <Package size={12} />
                            {shipment.customer?.name}
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;