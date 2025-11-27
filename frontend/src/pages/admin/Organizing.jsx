// frontend/src/pages/admin/Organizing.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaPlus, FaTrash, FaFilePdf } from "react-icons/fa";
import AddOrganizing from "./AddOrganizing"; 
import PdfThumb from "../../components/PdfThumb";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.id";
const LIST_ENDPOINT = `${API_BASE}/api/organizing`;
const DELETE_ENDPOINT = (id) => `${API_BASE}/api/organizing/${id}`;
const PDF_URL = (filename) => `${API_BASE}/uploads/organizing/${filename}`;

const Organizing = () => {
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
      setError("Gagal mengambil data organizing. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const opts = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", opts);
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    const ok = confirm(`Hapus dokumen "${row.title}"?`);
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesi habis atau Anda belum login. Silakan login ulang.");
        return;
      }

      await axios.delete(DELETE_ENDPOINT(row.id), { 
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true 
      });

      setRows((prev) => prev.filter((x) => x.id !== row.id));
      alert("Data berhasil dihapus.");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal menghapus data.";
      alert(msg);
    }
  };

  const bodyRows = useMemo(
    () =>
      rows.map((file, index) => {
        const pdfHref = file.pdf_file ? PDF_URL(file.pdf_file) : null;
        return (
          <tr key={file.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              {file.title || "-"}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
              {pdfHref ? (
                <div className="inline-block rounded border overflow-hidden">
                   {/* Thumbnail */}
                  <PdfThumb url={pdfHref} width={90} className="block" />
                </div>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              {pdfHref ? (
                <a
                  href={pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline inline-flex items-center"
                >
                  <FaFilePdf className="mr-2" />
                  {file.pdf_file}
                </a>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              {formatDate(file.uploaded_at)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
              <button
                onClick={() => handleDelete(file)}
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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <SidebarAdmin />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Organizing</h1>
        </header>

        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-6 space-y-4">
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
              {error}
            </p>
          )}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            
            {/* Header Card dengan Garis Hitam */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black">
              <h2 className="text-xl font-semibold text-blue-700">Daftar Organizing</h2>
              {/* Tombol Desktop: hidden di mobile */}
              <button
                onClick={() => setOpenModal(true)}
                className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition"
              >
                <FaPlus /> Tambah Data
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="grid place-items-center h-48 text-gray-500">Memuat data…</div>
              ) : rows.length === 0 ? (
                <div className="grid place-items-center h-48 text-gray-500">
                  Belum ada data.
                </div>
              ) : (
                // PERUBAHAN DISINI: Tampilkan tabel di semua ukuran layar dengan scroll horizontal
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Judul Dokumen
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Thumbnail
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            PDF
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Waktu Upload
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">{bodyRows}</tbody>
                    </table>
                </div>
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

      {/* Tombol FAB Mobile */}
      <button
        onClick={() => setOpenModal(true)}
        className="md:hidden fixed bottom-24 right-5 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 grid place-items-center active:scale-95 z-50"
        aria-label="Tambah Data"
        title="Tambah Data"
      >
        <FaPlus />
      </button>

      <AddOrganizing open={openModal} onClose={() => setOpenModal(false)} onSuccess={fetchRows} />
    </div>
  );
};

export default Organizing;