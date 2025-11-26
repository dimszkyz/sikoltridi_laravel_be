// frontend/src/pages/admin/ControllingAdmin.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import * as XLSX from "xlsx";
import { FaSync, FaFileExcel } from "react-icons/fa"; // Import ikon

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.id";
const LIST_ENDPOINT = `${API_BASE}/api/kuesioner`;

const ControllingAdmin = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Ambil data dari backend ===
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(LIST_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data.data || (Array.isArray(response.data) ? response.data : []);
      setData(responseData);

    } catch (err) {
      console.error("Gagal ambil data:", err);
      if (err.response && err.response.status === 401) {
        setError("Sesi telah habis. Silakan login kembali.");
      } else {
        setError("Gagal memuat data controlling. Pastikan server backend aktif.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === Fungsi export ke Excel ===
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Controlling");
    XLSX.writeFile(workbook, "Data_Controlling.xlsx");
  };

  // === Kolom tabel sesuai struktur SQL ===
  const columns = [
    "nama_responden", "jabatan", "lembaga",
    "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10",
    "b1", "b2", "b3", "b4", "b5",
    "c1", "c2", "c3", "c4", "c5",
    "d1", "d2", "d3", "d4",
  ];

  // === Baris tabel ===
  const tableRows = useMemo(() => {
    return data.map((item, idx) => (
      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
        <td className="border px-3 py-2 text-center">{idx + 1}</td>
        <td className="border px-3 py-2 whitespace-nowrap">{item.nama_responden}</td>
        <td className="border px-3 py-2 whitespace-nowrap">{item.jabatan}</td>
        <td className="border px-3 py-2 whitespace-nowrap">{item.lembaga}</td>
        {columns.slice(3).map((col) => (
          <td key={col} className="border px-3 py-2 text-center">
            {item[col]}
          </td>
        ))}
      </tr>
    ));
  }, [data]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <SidebarAdmin />

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header atas halaman */}
        <header className="flex items-center p-4 bg-white border-b shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800">
            Data Controlling
          </h1>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            
            {/* --- HEADER CARD DENGAN GARIS PEMISAH & TOMBOL RESPONSIF --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b border-gray-200 gap-4 bg-white rounded-t-lg">
              <h2 className="text-xl font-semibold text-blue-700 w-full md:w-auto">
                Laporan Kuesioner
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Tombol Refresh */}
                <button
                  onClick={fetchData}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm active:scale-95 transition-all w-full sm:w-auto"
                >
                  <FaSync className={loading ? "animate-spin" : ""} />
                  Refresh Data
                </button>

                {/* Tombol Export */}
                <button
                  onClick={exportToExcel}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm active:scale-95 transition-all w-full sm:w-auto"
                >
                  <FaFileExcel />
                  Export Excel
                </button>
              </div>
            </div>

            {/* --- BODY CARD --- */}
            <div className="p-6">
              {/* Status loading/error */}
              {loading && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-gray-500 text-sm mt-3 font-medium">Sedang memuat data...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* === Tabel Data === */}
              {!loading && !error && (
                data.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-gray-500 italic">Belum ada data kuesioner yang masuk.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="min-w-full text-sm text-gray-800">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold tracking-wider">
                        <tr>
                          <th className="border px-3 py-3 text-center">No</th>
                          <th className="border px-3 py-3 text-left">Nama</th>
                          <th className="border px-3 py-3 text-left">Jabatan</th>
                          <th className="border px-3 py-3 text-left">Lembaga</th>
                          {columns.slice(3).map((col) => (
                            <th
                              key={col}
                              className="border px-3 py-3 text-center whitespace-nowrap"
                            >
                              {col.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {tableRows}
                      </tbody>
                    </table>
                  </div>
                )
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
    </div>
  );
};

export default ControllingAdmin;