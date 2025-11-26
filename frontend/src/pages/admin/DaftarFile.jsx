// frontend/src/pages/admin/DaftarFile.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaPlus, FaTrash, FaFilePdf } from "react-icons/fa";
import PdfThumb from "../../components/PdfThumb";
import AddFile from "./AddFile"; 

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.id";
const LIST_ENDPOINT = `${API_BASE}/api/files`;
const DELETE_ENDPOINT = (id) => `${API_BASE}/api/files/${id}`;
const PDF_URL = (filename) => `${API_BASE}/uploads/files/${filename}`;

const DaftarFile = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(LIST_ENDPOINT);
      // Handle format response Laravel { data: [...] }
      const data = response.data.data || (Array.isArray(response.data) ? response.data : []);
      setFiles(data);
    } catch (err) {
      setError("Gagal mengambil data file. Pastikan server backend berjalan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus file "${title}"?`)) return;
    
    try {
      // --- PERBAIKAN: Ambil Token & Kirim di Header ---
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda tidak memiliki akses atau sesi habis. Silakan login.");
        return;
      }

      await axios.delete(DELETE_ENDPOINT(id), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("File berhasil dihapus!");
      fetchFiles(); // refresh data
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal menghapus file. Coba lagi.";
      alert(msg);
    }
  };

  const tableRows = useMemo(
    () =>
      files.map((file, index) => {
        const pdfHref = file.pdf_file ? PDF_URL(file.pdf_file) : null;
        return (
          <tr key={file.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.title}</td>

            {/* Thumbnail dari PDF */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {pdfHref ? (
                <div
                  className="inline-block rounded border overflow-hidden cursor-pointer"
                  title="Klik untuk membuka PDF"
                  onClick={() => window.open(pdfHref, "_blank")}
                >
                  <PdfThumb url={pdfHref} width={90} className="block" />
                </div>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </td>

            {/* Link PDF */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {pdfHref ? (
                <a
                  href={pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline inline-flex items-center"
                  aria-label={`Buka PDF ${file.title}`}
                >
                  <FaFilePdf className="mr-2" />
                  {file.pdf_file}
                </a>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatDate(file.uploaded_at)}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
              <button
                onClick={() => handleDelete(file.id, file.title)}
                className="text-red-600 hover:text-red-900 rounded p-2 hover:bg-red-50"
                title="Hapus"
              >
                <FaTrash size={18} />
              </button>
            </td>
          </tr>
        );
      }),
    [files]
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <SidebarAdmin />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen File</h1>
        </header>

        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-6">
          {/* Card Container: padding dihapus disini agar border header bisa full width */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            
            {/* Header tabel dengan Border Bawah (Garis) */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-blue-700">Daftar File</h2>
              
              {/* Tombol Desktop */}
              <button
                onClick={() => setOpenModal(true)}
                className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition"
              >
                <FaPlus className="mr-2" />
                Tambah Data
              </button>
            </div>

            {/* Body Content dengan Padding */}
            <div className="p-6">
              {/* Error message */}
              {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

              {/* Loading state */}
              {loading ? (
                <div className="text-center text-gray-500 py-10">Memuat data...</div>
              ) : files.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Belum ada file diunggah.</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Judul File
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Thumbnail
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          File PDF
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Waktu Upload
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">{tableRows}</tbody>
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

      {/* Tombol Mobile (FAB) */}
      <button
        onClick={() => setOpenModal(true)}
        className="md:hidden fixed bottom-5 right-5 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 grid place-items-center active:scale-95 z-50"
        aria-label="Tambah Data"
        title="Tambah Data"
      >
        <FaPlus />
      </button>

      {/* Modal Tambah File */}
      <AddFile open={openModal} onClose={() => setOpenModal(false)} onSuccess={fetchFiles} />
    </div>
  );
};

export default DaftarFile;