import React, { useState } from 'react';
import { User, Lock, Save, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SettingsView = ({ user, onUpdateSession }) => {
  const [username, setUsername] = useState(user.username || '');
  const [fullName, setFullName] = useState(user.fullName || '');
  const [password, setPassword] = useState(''); // Password baru (opsional)
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Siapkan payload
    const payload = {
      username: username,
      fullName: fullName,
      role: user.role,
    };

    // Hanya kirim password jika diisi
    if (password) {
      payload.password = password;
    }

    try {
      const token = localStorage.getItem('logistic_token');
      const userId = user.id || user._id;

      // Gunakan dynamic URL dan tambahkan Auth Header
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update sesi lokal di App.js agar header langsung berubah tanpa logout
        onUpdateSession(updatedUser);

        toast.success('Profil berhasil diperbarui!');
        setPassword(''); // Reset field password demi keamanan
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h2>
          <p className="text-slate-500">Kelola informasi profil dan keamanan Anda</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Peran (Role)</label>
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600">
                <Shield size={16} />
                <span>{user.role}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Form Edit */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password Baru</label>
              <input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengganti password"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-slate-400">Minimal 6 karakter disarankan.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save size={18} />
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SettingsView;
