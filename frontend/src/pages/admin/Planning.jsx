// frontend/src/pages/admin/Planning.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaPlus, FaTrash, FaFilePdf } from "react-icons/fa";
import AddPlanning from "./AddPlanning";
import PdfThumb from "../../components/PdfThumb";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LIST_ENDPOINT = `${API_BASE}/api/planning`;
const DELETE_ENDPOINT = (id) => `${API_BASE}/api/planning/${id}`;
const PDF_URL = (filename) => `${API_BASE}/uploads/planning/${filename}`;

const Planning = () => {
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
      setError("Gagal mengambil data planning. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const opts = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("id-ID", opts);
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    const ok = confirm(`Hapus dokumen "${row.title}"?`);
    if (!ok) return;
    try {
      await axios.delete(DELETE_ENDPOINT(row.id), { withCredentials: true });
      setRows((prev) => prev.filter((x) => x.id !== row.id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    }
  };

  const bodyRows = useMemo(
    () =>
      rows.map((file, index) => {
        const pdfHref = file.pdf_file ? PDF_URL(file.pdf_file) : null;
        return (
          <tr key={file.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{file.title || "-"}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              {pdfHref ? (
                <div className="flex items-center">
                  <PdfThumb url={pdfHref} width={90} className="rounded border" />
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
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
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

  const mobileCards = useMemo(
    () =>
      rows.map((file) => {
        const pdfHref = file.pdf_file ? PDF_URL(file.pdf_file) : null;
        return (
          <div key={file.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-gray-800">{file.title || "Tanpa Judul"}</h3>
              <button
                onClick={() => handleDelete(file)}
                className="text-red-600 hover:text-red-700 rounded p-2 hover:bg-red-50"
                title="Hapus"
              >
                <FaTrash size={16} />
              </button>
            </div>

            <div className="mt-3">
              {pdfHref ? (
                <div
                  className="rounded-lg overflow-hidden border"
                  onClick={() => window.open(pdfHref, "_blank")}
                  role="button"
                  title="Buka PDF"
                >
                  <PdfThumb url={pdfHref} width={560} className="w-full" />
                </div>
              ) : (
                <div className="h-40 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                  Tidak ada PDF
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>Diunggah: {formatDate(file.uploaded_at)}</span>
              {pdfHref && (
                <a
                  href={pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <FaFilePdf /> Lihat PDF
                </a>
              )}
            </div>
          </div>
        );
      }),
    [rows]
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur border-b px-4 py-3">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Planning</h1>
          
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-4">
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">{error}</p>
          )}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Toolbar card: tombol pindah ke sini, tampil di md+ */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-blue-700">Daftar Planning</h2>
              <button
                onClick={() => setOpenModal(true)}
                className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition"
              >
                <FaPlus /> Tambah Data
              </button>
            </div>

            <div className="p-4 md:p-6">
              {loading ? (
                <div className="grid place-items-center h-48 text-gray-500">Memuat data…</div>
              ) : rows.length === 0 ? (
                <div className="grid place-items-center h-48 text-gray-500">Belum ada data.</div>
              ) : (
                <>
                  {/* Mobile: cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">{mobileCards}</div>

                  {/* Desktop: table */}
                  <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Judul Dokumen
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Thumbnail
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            PDF
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Waktu Upload
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">{bodyRows}</tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* FAB (mobile only) */}
      <button
        onClick={() => setOpenModal(true)}
        className="md:hidden fixed bottom-5 right-5 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 grid place-items-center active:scale-95"
        aria-label="Tambah Data"
        title="Tambah Data"
      >
        <FaPlus />
      </button>

      {/* Modal Upload */}
      <AddPlanning open={openModal} onClose={() => setOpenModal(false)} onSuccess={fetchRows} />
    </div>
  );
};

export default Planning;
