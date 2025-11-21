// frontend/src/pages/admin/admin.jsx
import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaSearch, FaTrash, FaUsers, FaFileAlt, FaCalendarAlt, FaVideo, FaImage } from "react-icons/fa";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const FILE_ENDPOINT = `${API_BASE}/api/files`;
const USER_ENDPOINT = `${API_BASE}/api/users/list-user`;
const PLANNING_ENDPOINT = `${API_BASE}/api/planning`; // endpoint planning
const ORGANIZING_ENDPOINT = `${API_BASE}/api/organizing`;
const VIDEO_ENDPOINT = `${API_BASE}/api/video`;
const FOTO_ENDPOINT = `${API_BASE}/api/foto`;

const Admin = () => {
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [planningRows, setPlanningRows] = useState([]);
  const [totalPlanning, setTotalPlanning] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalOrganizing, setTotalOrganizing] = useState(0);
  const [organizingRows, setOrganizingRows] = useState([]);
  const [totalVideo, setTotalVideo] = useState(0);
  const [videoRows, setVideoRows] = useState([]);
  const [totalFoto, setTotalFoto] = useState(0);
  const [fotoRows, setFotoRows] = useState([]);
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);


  // Ambil data file dari backend
  const fetchOrganizing = async () => {
    try {
      const res = await axios.get(ORGANIZING_ENDPOINT, { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setOrganizingRows(data);
      setTotalOrganizing(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data organizing:", err);
      return [];
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(FILE_ENDPOINT);
      const data = res.data?.data || [];
      setFiles(data);
      setTotalFiles(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data file:", err);
      return [];
    }
  };

  // Ambil data planning dari backend
  const fetchPlanning = async () => {
    try {
      const res = await axios.get(PLANNING_ENDPOINT, { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setPlanningRows(data);
      setTotalPlanning(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data planning:", err);
      return [];
    }
  };

  // Ambil data user
  const fetchUsers = async () => {
    try {
      const res = await axios.get(USER_ENDPOINT);
      const data = res.data?.data || [];
      setUsers(data);
      setTotalUsers(data.length);
    } catch (err) {
      console.error("Gagal memuat data user:", err);
    }
  };

  const fetchVideo = async () => {
    try {
      const res = await axios.get(VIDEO_ENDPOINT, { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setVideoRows(data);
      setTotalVideo(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data video:", err);
      return [];
    }
  };

  const fetchFoto = async () => {
    try {
      const res = await axios.get(FOTO_ENDPOINT, { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setFotoRows(data);
      setTotalFoto(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data foto:", err);
      return [];
    }
  };


  // Gabungkan dan buat chart untuk files + planning berdasarkan tanggal
  // 🔶 Fungsi buildCombinedChart lengkap (versi final)
  const buildCombinedChart = (
    filesData = [],
    planningData = [],
    organizingData = [],
    videoData = [],
    fotoData = []
  ) => {
    // Fungsi bantu: ubah tanggal jadi format yyyy-mm-dd
    const getDateKey = (d) => {
      if (!d) return null;
      const dt = new Date(d);
      if (isNaN(dt)) return null;
      return dt.toISOString().slice(0, 10);
    };

    // Format label tanggal agar tampil rapi di sumbu X
    const formatLabel = (isoKey) => {
      const dt = new Date(isoKey);
      return dt.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Hitung jumlah File per tanggal
    const filesCount = {};
    filesData.forEach((f) => {
      const key = getDateKey(f.uploaded_at);
      if (!key) return;
      filesCount[key] = (filesCount[key] || 0) + 1;
    });

    // Hitung jumlah Planning per tanggal
    const planningCount = {};
    planningData.forEach((p) => {
      const key = getDateKey(p.uploaded_at);
      if (!key) return;
      planningCount[key] = (planningCount[key] || 0) + 1;
    });

    // Hitung jumlah Organizing per tanggal
    const organizingCount = {};
    organizingData.forEach((o) => {
      const key = getDateKey(o.uploaded_at);
      if (!key) return;
      organizingCount[key] = (organizingCount[key] || 0) + 1;
    });

    // Hitung jumlah Video per tanggal
    const videoCount = {};
    videoData.forEach((v) => {
      const key = getDateKey(v.tanggal);
      if (!key) return;
      videoCount[key] = (videoCount[key] || 0) + 1;
    });

    // 🟧 Hitung jumlah Foto per tanggal
    const fotoCount = {};
    fotoData.forEach((f) => {
      const key = getDateKey(f.tanggal);
      if (!key) return;
      fotoCount[key] = (fotoCount[key] || 0) + 1;
    });

    // Gabungkan semua tanggal dari berbagai sumber
    const allKeys = Array.from(
      new Set([
        ...Object.keys(filesCount),
        ...Object.keys(planningCount),
        ...Object.keys(organizingCount),
        ...Object.keys(videoCount),
        ...Object.keys(fotoCount),
      ])
    ).sort();

    // Buat label & nilai tiap dataset
    const labels = allKeys.map(formatLabel);
    const fileValues = allKeys.map((k) => filesCount[k] || 0);
    const planningValues = allKeys.map((k) => planningCount[k] || 0);
    const organizingValues = allKeys.map((k) => organizingCount[k] || 0);
    const videoValues = allKeys.map((k) => videoCount[k] || 0);
    const fotoValues = allKeys.map((k) => fotoCount[k] || 0);

    // Jika tidak ada data, kosongkan chart
    if (labels.length === 0) {
      setChartData(null);
      return;
    }

    // Set data untuk Chart.js
    setChartData({
      labels,
      datasets: [
        {
          label: "Upload File",
          data: fileValues,
          backgroundColor: "rgba(59,130,246,0.75)", // biru
          borderRadius: 6,
        },
        {
          label: "Upload Planning",
          data: planningValues,
          backgroundColor: "rgba(16,185,129,0.75)", // hijau
          borderRadius: 6,
        },
        {
          label: "Upload Organizing",
          data: organizingValues,
          backgroundColor: "rgba(234,179,8,0.75)", // kuning
          borderRadius: 6,
        },
        {
          label: "Upload Video",
          data: videoValues,
          backgroundColor: "rgba(239,68,68,0.75)", // merah
          borderRadius: 6,
        },
        {
          label: "Upload Foto",
          data: fotoValues,
          backgroundColor: "rgba(249,115,22,0.85)", // 🟧 jingga/oranye
          borderRadius: 6,
        },
      ],
    });
  };

  // Hapus user
  const deleteUser = async (id, username) => {
    if (window.confirm(`Hapus user ${username}?`)) {
      try {
        await axios.delete(`${API_BASE}/api/users/delete-user/${id}`);
        alert(`🗑️ User ${username} dihapus`);
        fetchUsers();
      } catch (err) {
        console.error("Gagal menghapus user:", err);
      }
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [filesData, planningData, organizingData, videoData, fotoData] =
          await Promise.all([
            fetchFiles(),
            fetchPlanning(),
            fetchOrganizing(),
            fetchVideo(),
            fetchFoto(), // 🟧 baru ditambahkan
          ]);

        buildCombinedChart(filesData, planningData, organizingData, videoData, fotoData);
        await fetchUsers();
      } finally {
        setLoading(false);
      }
    };
    loadAll();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const u = parsed.user || parsed;
      setUser(u);
      setIsSuperAdmin(u?.level === "superadmin");
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <SidebarAdmin />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

        </header>


        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 space-y-8">
          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isSuperAdmin && (
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total User</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <FaUsers className="text-blue-500 w-12 h-12" />
              </div>
            )}


            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total File</p>
                <p className="text-2xl font-bold">{totalFiles}</p>
              </div>
              <FaFileAlt className="text-blue-500 w-12 h-12" />
            </div>

            {/* Total Planning di sebelah Total File */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Planning</p>
                <p className="text-2xl font-bold">{totalPlanning}</p>
              </div>
              <FaCalendarAlt className="text-green-500 w-12 h-12" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Organizing</p>
                <p className="text-2xl font-bold">{totalOrganizing}</p>
              </div>
              <FaCalendarAlt className="text-yellow-500 w-12 h-12" />
            </div>

            {/* placeholder card (kosong) agar layout tetap rapi, bisa diisi fitur lain */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Video</p>
                <p className="text-2xl font-bold">{totalVideo}</p>
              </div>
              <FaVideo className="text-red-500 w-12 h-12" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Foto</p>
                <p className="text-2xl font-bold">{totalFoto}</p>
              </div>
              <FaImage className="text-orange-500 w-12 h-12" />
            </div>

          </div>

          {/* Grafik Upload File & Planning */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Grafik Upload per Tanggal</h2>
            {loading ? (
              <p className="text-gray-500">Memuat data grafik...</p>
            ) : !chartData || chartData.labels.length === 0 ? (
              <p className="text-gray-500">Belum ada data upload.</p>
            ) : (
              <div style={{ width: "100%", height: 350 }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: true, position: "top" },
                      title: { display: false },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: { beginAtZero: true, ticks: { precision: 0 } },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Data User */}
          {isSuperAdmin && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Daftar User</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.level}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => deleteUser(user.id, user.username)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-2"
                          >
                            <FaTrash /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
