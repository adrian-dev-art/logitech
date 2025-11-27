import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, Edit2, Save } from 'lucide-react';

const CustomerListView = ({ customers, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onCreate(formData);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Manajemen Pelanggan</h2>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm"
        >
          <Plus size={16} />
          {showForm && !editingId ? 'Batal' : 'Tambah Pelanggan'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800">{editingId ? 'Edit Pelanggan' : 'Pelanggan Baru'}</h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm">Batal</button>
           </div>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Nama Lengkap" className="border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Alamat Email" className="border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required placeholder="Nomor Telepon" className="border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input required placeholder="Alamat" className="border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 flex items-center justify-center gap-2 md:col-span-2">
                <Save size={16} />
                {editingId ? 'Perbarui Pelanggan' : 'Simpan Pelanggan'}
              </button>
           </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={14} />
                      </div>
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs"><Mail size={12}/> {customer.email}</div>
                      <div className="flex items-center gap-2 text-xs"><Phone size={12}/> {customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {customer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(customer.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <div className="p-8 text-center text-slate-500">Tidak ada pelanggan ditemukan.</div>}
        </div>
      </div>
    </div>
  );
};

export default CustomerListView;