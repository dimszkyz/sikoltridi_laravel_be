import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";

// 1. Gunakan Port Laravel (8000)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const DaftarPengajuanAkun = () => {
  const [pengajuan, setPengajuan] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  // Helper untuk Header Token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // --- FETCH DATA PENGAJUAN ---
  const fetchData = async () => {
    try {
      // Endpoint sesuai api.php: '/api/pengajuan-akun'
      const res = await axios.get(`${API_BASE}/api/pengajuan-akun`, getAuthHeader());
      // Handle format { data: [...] }
      const data = res.data.data || (Array.isArray(res.data) ? res.data : []);
      setPengajuan(data);
    } catch (err) {
      console.error("Gagal ambil pengajuan:", err);
    }
  };

  // --- FETCH DATA USER AKTIF ---
  const fetchUsers = async () => {
    try {
      // Endpoint sesuai api.php: '/api/users-db'
      const res = await axios.get(`${API_BASE}/api/users-db`, getAuthHeader());
      // Handle format { data: [...] }
      const data = res.data.data || (Array.isArray(res.data) ? res.data : []);
      setUsers(data);
    } catch (err) {
      console.error("Gagal ambil users:", err);
    } finally {
        setLoading(false);
    }
  };

  // --- ACTION: APPROVE (TERIMA) ---
  const approve = async (id, role) => {
    const selectedUser = pengajuan.find((item) => item.id === id);
    const username = selectedUser?.username || "Pengguna";

    try {
      // Endpoint sesuai api.php: PUT '/api/approve-akun/{id}'
      await axios.put(
        `${API_BASE}/api/approve-akun/${id}`, 
        { role }, // Body
        getAuthHeader() // Header
      );
      
      alert(`✅ Akun ${username} disetujui sebagai ${role}!`);
      fetchData();  // Refresh tabel pengajuan
      fetchUsers(); // Refresh tabel user aktif
    } catch (err) {
      console.error(err);
      alert("Gagal menyetujui akun.");
    }
  };

  // --- ACTION: REJECT (TOLAK) ---
  const reject = async (id) => {
    const selectedUser = pengajuan.find((item) => item.id === id);
    const username = selectedUser?.username || "Pengguna";

    if (!window.confirm(`Tolak pengajuan akun ${username}?`)) return;

    try {
      // Endpoint sesuai api.php: DELETE '/api/reject-akun/{id}'
      await axios.delete(`${API_BASE}/api/reject-akun/${id}`, getAuthHeader());
      
      alert(`❌ Akun ${username} ditolak & dihapus!`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menolak akun.");
    }
  };

  // --- ACTION: DELETE USER AKTIF ---
  const deleteUser = async (id, username) => {
    if (!window.confirm(`Hapus user ${username} secara permanen?`)) return;

    try {
      // Endpoint sesuai api.php: DELETE '/api/users/{id}'
      await axios.delete(`${API_BASE}/api/users/${id}`, getAuthHeader());
      
      alert(`🗑️ User ${username} berhasil dihapus.`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus user.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      
      <div className="flex-1 flex flex-col overflow-hidden">
         <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen User</h1>
        </header>

        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-6">
            
            {/* TABEL PENGAJUAN */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-4 border-b bg-blue-50">
                    <h2 className="text-lg font-bold text-blue-800">Daftar Pengajuan Akun (Pending)</h2>
                </div>
                <div className="overflow-x-auto p-4">
                    {pengajuan.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Tidak ada pengajuan baru.</p>
                    ) : (
                        <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                            <th className="p-3 text-left border">No</th>
                            <th className="p-3 text-left border">Username</th>
                            <th className="p-3 text-left border">Nama Lengkap</th>
                            <th className="p-3 text-left border">Jabatan</th>
                            <th className="p-3 text-left border">NIP/NIK</th>
                            <th className="p-3 text-left border">Role</th>
                            <th className="p-3 text-center border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pengajuan.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-3 border">{index + 1}</td>
                                <td className="p-3 border font-medium">{item.username}</td>
                                <td className="p-3 border">{item.nama_lengkap || '-'}</td>
                                <td className="p-3 border">{item.jabatan || '-'}</td>
                                <td className="p-3 border">{item.nip_nik || '-'}</td>
                                <td className="p-3 border">
                                <select
                                    value={item.role || "user"}
                                    onChange={(e) => {
                                    const updated = pengajuan.map((row) =>
                                        row.id === item.id ? { ...row, role: e.target.value } : row
                                    );
                                    setPengajuan(updated);
                                    }}
                                    className="border px-2 py-1 rounded bg-white focus:ring-2 focus:ring-blue-300 outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                                </td>
                                <td className="p-3 border text-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
                                        onClick={() => approve(item.id, item.role || "user")}
                                        title="Terima"
                                    >
                                        <FaCheckCircle /> 
                                    </button>
                                    <button
                                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
                                        onClick={() => reject(item.id)}
                                        title="Tolak"
                                    >
                                        <FaTimesCircle /> 
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* TABEL USER AKTIF */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Daftar User Aktif (Database)</h2>
                </div>
                <div className="overflow-x-auto p-4">
                    {loading ? (
                        <p className="text-center text-gray-500 py-4">Memuat data user...</p>
                    ) : users.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Belum ada user aktif.</p>
                    ) : (
                        <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                            <th className="p-3 text-center border w-16">No</th>
                            <th className="p-3 text-left border">Username</th>
                            <th className="p-3 text-left border">Role</th>
                            <th className="p-3 text-center border w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                            <tr key={user.id_user || user.id} className="hover:bg-gray-50">
                                <td className="p-3 text-center border">{idx + 1}</td>
                                <td className="p-3 border font-medium">{user.username}</td>
                                <td className="p-3 border capitalize">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                                        ${user.level === 'superadmin' ? 'bg-purple-100 text-purple-700' : 
                                          user.level === 'admin' ? 'bg-blue-100 text-blue-700' : 
                                          'bg-gray-100 text-gray-700'}`}>
                                        {user.level}
                                    </span>
                                </td>
                                <td className="p-3 text-center border">
                                <button
                                    onClick={() => deleteUser(user.id_user || user.id, user.username)}
                                    className="flex items-center justify-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition mx-auto"
                                >
                                    <FaTrash size={14} /> Hapus
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                </div>
            </div>

        </main>
      </div>
    </div>
  );
};

export default DaftarPengajuanAkun;