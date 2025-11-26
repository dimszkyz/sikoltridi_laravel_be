import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import AddFoto from "./AddFoto";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.sidome.id";
const LIST_ENDPOINT = `${API_BASE}/api/foto`;
const DELETE_ENDPOINT = (id) => `${API_BASE}/api/foto/${id}`;
const IMAGE_URL = (filename) => `${API_BASE}/uploads/foto/${filename}`;

const Foto = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(LIST_ENDPOINT, { withCredentials: true });
      // Backend mengembalikan array langsung, jadi kita cek res.data
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRows(data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data foto. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (row) => {
    if (!row?.id) return;
    // Gunakan title atau judul sebagai konfirmasi
    const ok = confirm(`Hapus foto "${row.title || row.judul}"?`);
    if (!ok) return;
    
    try {
      // Ambil Token untuk keamanan
      const token = localStorage.getItem("token");
      await axios.delete(DELETE_ENDPOINT(row.id), { 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true 
      });
      setRows((prev) => prev.filter((x) => x.id !== row.id));
      alert("Foto berhasil dihapus.");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus foto.");
    }
  };

  const bodyRows = useMemo(
    () =>
      rows.map((item, index) => {
        // PERBAIKAN 1: Gunakan 'image_file' sesuai database, bukan 'foto'
        const imgSrc = item.image_file ? IMAGE_URL(item.image_file) : null;
        
        return (
          <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
            {/* Backend mengirim 'title', tapi kita support 'judul' juga untuk jaga-jaga */}
            <td className="px-4 py-3 text-sm text-gray-800">{item.title || item.judul || "-"}</td>
            <td className="px-4 py-3 text-sm text-gray-800">
              {imgSrc ? (
                <img 
                  src={imgSrc} 
                  alt={item.title} 
                  className="w-28 h-20 object-cover rounded border"
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-800">
              {/* Gunakan uploaded_at karena di backend memakai itu */}
              {item.uploaded_at 
                ? new Date(item.uploaded_at).toLocaleDateString("id-ID") 
                : (item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID") : "-")
              }
            </td>
            {/* PERBAIKAN 2: Gunakan 'deskripsi_image' sesuai database, bukan 'deskripsi' */}
            <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate" title={item.deskripsi_image}>
                {item.deskripsi_image || item.deskripsi || "-"}
            </td>
            <td className="px-4 py-3 text-sm font-medium">
              <button
                onClick={() => handleDelete(item)}
                className="text-red-600 hover:text-red-900 rounded p-2 hover:bg-red-50 transition"
                title="Hapus"
              >
                <FaTrash size={16} />
              </button>
            </td>
          </tr>
        );
      }),
    [rows]
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur border-b px-4 py-3 shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaImage className="text-blue-600" /> Manajemen Foto
          </h1>
          <button
            onClick={() => setOpenModal(true)}
            className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition shadow"
          >
            <FaPlus /> Tambah Foto
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded shadow-sm">
              {error}
            </p>
          )}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-0 overflow-x-auto">
              {loading ? (
                <div className="grid place-items-center h-48 text-gray-500">Memuat data...</div>
              ) : rows.length === 0 ? (
                <div className="grid place-items-center h-48 text-gray-500">Belum ada foto.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Foto</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">{bodyRows}</tbody>
                </table>
              )}
            </div>
          </div>
        </main>
          <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm shrink-0">
            <p className="tracking-wide">
              © Copyright <span className="font-bold">GAZEBO CODING 2025</span> All Rights Reserved
            </p>
        </footer>
      </div>

      {/* FAB Mobile */}
      <button
        onClick={() => setOpenModal(true)}
        className="md:hidden fixed bottom-5 right-5 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg grid place-items-center active:scale-95 z-50"
      >
        <FaPlus />
      </button>

      <AddFoto open={openModal} onClose={() => setOpenModal(false)} onSuccess={fetchRows} />
    </div>
  );
};

export default Foto;