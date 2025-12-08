import React, { useState } from 'react';
import { User, Lock, Shield, Plus, Trash2, Edit2, Save } from 'lucide-react';

const UserListView = ({ users, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'STAFF'
  });

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', fullName: '', phone: '', role: 'STAFF' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't populate password for security
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role
    });
    setEditingId(user.id || user._id);
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
        <h2 className="text-xl font-bold text-slate-900">Manajemen Pengguna</h2>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm"
        >
          <Plus size={16} />
          {showForm && !editingId ? 'Batal' : 'Tambah Pengguna'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">{editingId ? 'Edit Pengguna' : 'Pengguna Baru'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm">Batal</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Username</label>
              <input
                required
                placeholder="Username Login"
                className="w-full border p-2 rounded"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Email</label>
              <input required type="email" placeholder="email@example.com" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Password</label>
              <input required={!editingId} type="password" placeholder={editingId ? "Kosongkan jika tidak ingin mengubah" : "Password"} className="w-full border p-2 rounded" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Nama Lengkap</label>
              <input required placeholder="Nama Lengkap Staf" className="w-full border p-2 rounded" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">No. Telepon</label>
              <input placeholder="08123456789" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Peran (Role)</label>
              <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="ADMIN">Administrator</option>
                <option value="MANAGER">Manajer</option>
                <option value="DRIVER">Pengemudi</option>
                <option value="STAFF">Staf Gudang</option>
              </select>
            </div>

            <button type="submit" className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 flex items-center justify-center gap-2 md:col-span-2 mt-2">
              <Save size={16} />
              {editingId ? 'Perbarui Data' : 'Simpan Pengguna'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Peran</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((userItem) => (
                <tr key={userItem._id || userItem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <User size={14} />
                      </div>
                      {userItem.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Lock size={12} className="text-slate-400" />
                      {userItem.username}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${userItem.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        userItem.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'}`}>
                      <Shield size={10} />
                      {userItem.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(userItem)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(userItem._id || userItem.id)}
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
          {users.length === 0 && <div className="p-8 text-center text-slate-500">Tidak ada pengguna ditemukan.</div>}
        </div>
      </div>
    </div>
  );
};

export default UserListView;
