import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import AddFoto from "./AddFoto";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
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
    const ok = confirm(`Hapus foto "${row.judul}"?`);
    if (!ok) return;
    try {
      await axios.delete(DELETE_ENDPOINT(row.id), { withCredentials: true });
      setRows((prev) => prev.filter((x) => x.id !== row.id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus foto.");
    }
  };

  const bodyRows = useMemo(
    () =>
      rows.map((item, index) => {
        const imgSrc = IMAGE_URL(item.foto);
        return (
          <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
            <td className="px-4 py-3 text-sm text-gray-800">{item.judul || "-"}</td>
            <td className="px-4 py-3 text-sm text-gray-800">
              <img src={imgSrc} alt={item.judul} className="w-28 rounded border" />
            </td>
            <td className="px-4 py-3 text-sm text-gray-800">
              {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID") : "-"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-800">{item.deskripsi || "-"}</td>
            <td className="px-4 py-3 text-sm font-medium">
              <button
                onClick={() => handleDelete(item)}
                className="text-red-600 hover:text-red-900 rounded p-2 hover:bg-red-50"
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

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur border-b px-4 py-3">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaImage className="text-blue-600" /> Foto
          </h1>
          <button
            onClick={() => setOpenModal(true)}
            className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition"
          >
            <FaPlus /> Tambah Foto
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-4">
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
              {error}
            </p>
          )}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-4 md:p-6 overflow-x-auto">
              {loading ? (
                <div className="grid place-items-center h-48 text-gray-500">Memuat data…</div>
              ) : rows.length === 0 ? (
                <div className="grid place-items-center h-48 text-gray-500">Belum ada foto.</div>
              ) : (
                <table className="min-w-full border">
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
      </div>

      {/* FAB Mobile */}
      <button
        onClick={() => setOpenModal(true)}
        className="md:hidden fixed bottom-5 right-5 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg grid place-items-center active:scale-95"
      >
        <FaPlus />
      </button>

      <AddFoto open={openModal} onClose={() => setOpenModal(false)} onSuccess={fetchRows} />
    </div>
  );
};

export default Foto;