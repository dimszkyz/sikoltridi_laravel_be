import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaPlus, FaTrash, FaVideo } from "react-icons/fa"; // Hapus FaImage jika tidak dipakai
import AddVideo from "./AddVideo";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.sidome.id";

// --- PERBAIKAN UTAMA: Tambahkan 's' (videos) agar sesuai route Laravel ---
const LIST_ENDPOINT = `${API_BASE}/api/videos`;
const DELETE_ENDPOINT = (id) => `${API_BASE}/api/videos/${id}`;

// URL folder public
const VIDEO_URL = (filename) => `${API_BASE}/uploads/video/${filename}`;
const THUMB_URL = (filename) => `${API_BASE}/uploads/video/thumb/${filename}`;

const Video = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gunakan LIST_ENDPOINT yang sudah diperbaiki
      const res = await axios.get(LIST_ENDPOINT, { withCredentials: true });
      
      // Ambil data dengan aman (handle format { data: [...] } atau array langsung)
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRows(data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data video. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (row) => {
    if (!row?.id) return;
    const ok = confirm(`Hapus video "${row.judul}"?`);
    if (!ok) return;
    try {
      // Gunakan DELETE_ENDPOINT yang sudah diperbaiki (dan kirim token jika perlu)
      const token = localStorage.getItem("token"); // Ambil token untuk keamanan hapus
      await axios.delete(DELETE_ENDPOINT(row.id), { 
        headers: {
           Authorization: `Bearer ${token}` 
        },
        withCredentials: true 
      });
      
      setRows((prev) => prev.filter((x) => x.id !== row.id));
      alert("Video berhasil dihapus.");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus video.");
    }
  };

  const bodyRows = useMemo(
    () =>
      rows.map((vid, index) => {
        const videoSrc = VIDEO_URL(vid.media);
        const thumbSrc = vid.thumbnail ? THUMB_URL(vid.thumbnail) : null;
        
        return (
          <tr key={vid.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
            <td className="px-4 py-3 text-sm text-gray-800">{vid.judul || "-"}</td>
            <td className="px-4 py-3 text-sm text-gray-800">
              {thumbSrc ? (
                <img 
                  src={thumbSrc} 
                  alt="thumb" 
                  className="w-24 h-16 object-cover rounded border" 
                  onError={(e) => e.target.style.display = 'none'} // Sembunyikan jika error load
                />
              ) : (
                <span className="text-gray-400 text-xs italic">No Thumb</span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-800">
               {/* Gunakan tag video dengan ukuran kecil untuk preview */}
              <video 
                src={videoSrc} 
                className="w-32 h-20 object-cover rounded-md bg-black" 
                controls 
              />
            </td>
            <td className="px-4 py-3 text-sm text-gray-800">
              {vid.tanggal ? new Date(vid.tanggal).toLocaleDateString("id-ID") : "-"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate" title={vid.keterangan}>
              {vid.keterangan || "-"}
            </td>
            <td className="px-4 py-3 text-sm font-medium">
              <button
                onClick={() => handleDelete(vid)}
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
            <FaVideo className="text-blue-600" /> Manajemen Video
          </h1>
          <button
            onClick={() => setOpenModal(true)}
            className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition shadow"
          >
            <FaPlus /> Tambah Video
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
                <div className="grid place-items-center h-48 text-gray-500">Belum ada video.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thumbnail</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Preview</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ket</th>
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

      <AddVideo open={openModal} onClose={() => setOpenModal(false)} onSuccess={fetchRows} />
    </div>
  );
};

export default Video;