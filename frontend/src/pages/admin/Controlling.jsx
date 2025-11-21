// src/pages/admin/Controlling.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/sidebarAdmin";
import * as XLSX from "xlsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LIST_ENDPOINT = `${API_BASE}/api/kuesioner`;

const ControllingAdmin = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Ambil data dari backend ===
  const fetchData = async () => {
    try {
      const response = await axios.get(LIST_ENDPOINT);
      setData(response.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setError("Gagal memuat data controlling. Pastikan server backend aktif.");
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
    "nama_responden",
    "jabatan",
    "lembaga",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "a10",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "d1",
    "d2",
    "d3",
    "d4",
  ];

  // === Baris tabel ===
  const tableRows = useMemo(() => {
    return data.map((item, idx) => (
      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className="border px-3 py-2 text-center">{idx + 1}</td>
        <td className="border px-3 py-2">{item.nama_responden}</td>
        <td className="border px-3 py-2">{item.jabatan}</td>
        <td className="border px-3 py-2">{item.lembaga}</td>
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
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {/* Judul + Tombol di sebelah kanan */}
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2">
              <h2 className="text-lg font-semibold text-blue-700">
                Data Controlling
              </h2>
              <button
                onClick={exportToExcel}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
              >
                Export ke Excel
              </button>
            </div>

            {/* Status loading/error */}
            {loading && (
              <p className="text-gray-500 text-sm italic">Memuat data...</p>
            )}
            {error && (
              <p className="text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
                {error}
              </p>
            )}

            {/* === Tabel Data === */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm text-gray-800">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border px-3 py-2 text-center">No</th>
                      <th className="border px-3 py-2">Nama</th>
                      <th className="border px-3 py-2">Jabatan</th>
                      <th className="border px-3 py-2">Lembaga</th>
                      {columns.slice(3).map((col) => (
                        <th
                          key={col}
                          className="border px-3 py-2 text-center whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{tableRows}</tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ControllingAdmin;
