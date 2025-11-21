import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";

const DaftarPengajuanAkun = () => {
  const [pengajuan, setPengajuan] = useState([]);
  const [users, setUsers] = useState([]); // ➕ state user

  useEffect(() => {
    fetchData();
    fetchUsers(); // ➕ panggil ambil data user
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/users/pengajuan-akun");
    setPengajuan(res.data.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users/list-user");
    setUsers(res.data.data);
  };

  const approve = async (id, role) => {
    const selectedUser = pengajuan.find((item) => item.id === id);
    const username = selectedUser?.username || "Pengguna";

    await axios.post(`http://localhost:5000/api/users/approve/${id}`, { role });
    alert(`✅ Akun ${username} disetujui sebagai ${role}!`);
    fetchData();
    fetchUsers(); // refresh tabel user
  };

  const reject = async (id) => {
    const selectedUser = pengajuan.find((item) => item.id === id);
    const username = selectedUser?.username || "Pengguna";

    await axios.delete(`http://localhost:5000/api/users/reject/${id}`);
    alert(`❌ Akun ${username} ditolak & dihapus!`);
    fetchData();
  };

  const deleteUser = async (id, username) => {
    if (window.confirm(`Hapus user ${username}?`)) {
      await axios.delete(`http://localhost:5000/api/users/delete-user/${id}`);
      alert(`🗑️ User ${username} dihapus`);
      fetchUsers();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      
      <div className="flex-1">
         <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Daftar Pengajuan Akun</h1>
        </header>
        <div className="p-6">

        {/* TABEL PENGAJUAN */}
        <table className="w-full border border-gray-300 mb-10">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3 text-center border">No</th>
              <th className="p-3 text-center border">Username</th>
              <th className="p-3 text-center border">Nama Lengkap</th>
              <th className="p-3 text-center border">Jabatan</th>
              <th className="p-3 text-center border">NIP/NIK(Kepegawaian)</th>
              <th className="p-3 text-center border">Role</th>
              <th className="p-3 text-center border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengajuan.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100 transition border">
                <td className="p-3 text-center border">{index + 1}</td>
                <td className="p-3 text-center border">{item.username}</td>
                <td className="p-3 text-center border">{item.nama_lengkap}</td>
                <td className="p-3 text-center border">{item.jabatan}</td>
                <td className="p-3 text-center border">{item.nip_nik}</td>
                <td className="p-3 text-center border">
                  <select
                    value={item.role || "user"}
                    onChange={(e) => {
                      const updated = pengajuan.map((row) =>
                        row.id === item.id ? { ...row, role: e.target.value } : row
                      );
                      setPengajuan(updated);
                    }}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
                <td className="p-3 flex flex-col items-center gap-2 border">
                  <button
                    className="flex items-center gap-2 bg-green-600 px-3 py-1 text-white rounded hover:bg-green-700"
                    onClick={() => approve(item.id, item.role || "user")}
                  >
                    <FaCheckCircle /> Accept
                  </button>
                  <button
                    className="flex items-center gap-2 bg-red-600 px-3 py-1 text-white rounded hover:bg-red-700"
                    onClick={() => reject(item.id)}
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ➕ TABEL USER */}
        <h2 className="text-xl font-bold mb-4">Daftar User</h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3 text-center border">ID</th>
              <th className="p-3 text-center border">Username</th>
              <th className="p-3 text-center border">Role</th>
              <th className="p-3 text-center border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 border">
                <td className="p-3 text-center border">{user.id}</td>
                <td className="p-3 text-center border">{user.username}</td>
                <td className="p-3 text-center border">{user.level}</td>
                <td className="p-3 text-center border">
                  <button
                    onClick={() => deleteUser(user.id, user.username)}
                    className="flex items-center gap-2 bg-red-600 px-3 py-1 text-white rounded hover:bg-red-700 mx-auto"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarPengajuanAkun;
