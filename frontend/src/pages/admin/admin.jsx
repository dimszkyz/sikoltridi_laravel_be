// frontend/src/pages/admin/admin.jsx
import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/sidebarAdmin";
import { FaUsers, FaFileAlt, FaCalendarAlt, FaVideo, FaImage } from "react-icons/fa";
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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.sidome.id";

// Endpoint
const FILE_ENDPOINT = `${API_BASE}/api/files`;
const USER_ENDPOINT = `${API_BASE}/api/users-db`;
const PLANNING_ENDPOINT = `${API_BASE}/api/planning`;
const ORGANIZING_ENDPOINT = `${API_BASE}/api/organizing`;
const VIDEO_ENDPOINT = `${API_BASE}/api/videos`;
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
  
  const [organizingRows, setOrganizingRows] = useState([]);
  const [totalOrganizing, setTotalOrganizing] = useState(0);
  
  const [videoRows, setVideoRows] = useState([]);
  const [totalVideo, setTotalVideo] = useState(0);
  
  const [fotoRows, setFotoRows] = useState([]);
  const [totalFoto, setTotalFoto] = useState(0);
  
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // --- Fetch Functions ---

  const fetchFiles = async () => {
    try {
      const res = await axios.get(FILE_ENDPOINT, getAuthHeader());
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setFiles(data);
      setTotalFiles(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data file:", err);
      return [];
    }
  };

  const fetchPlanning = async () => {
    try {
      const res = await axios.get(PLANNING_ENDPOINT, getAuthHeader());
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setPlanningRows(data);
      setTotalPlanning(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data planning:", err);
      return [];
    }
  };

  const fetchOrganizing = async () => {
    try {
      const res = await axios.get(ORGANIZING_ENDPOINT, getAuthHeader());
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setOrganizingRows(data);
      setTotalOrganizing(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data organizing:", err);
      return [];
    }
  };

  const fetchVideo = async () => {
    try {
      const res = await axios.get(VIDEO_ENDPOINT, getAuthHeader());
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
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
      const res = await axios.get(FOTO_ENDPOINT, getAuthHeader());
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setFotoRows(data);
      setTotalFoto(data.length);
      return data;
    } catch (err) {
      console.error("Gagal memuat data foto:", err);
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USER_ENDPOINT, getAuthHeader());
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setUsers(data);
      setTotalUsers(data.length);
    } catch (err) {
      console.error("Gagal memuat data user:", err);
    }
  };

  // Gabungkan dan buat chart
  const buildCombinedChart = (
    filesData = [],
    planningData = [],
    organizingData = [],
    videoData = [],
    fotoData = []
  ) => {
    
    // --- PERBAIKAN UTAMA DI SINI ---
    // Menggunakan waktu lokal user (Browser Timezone)
    const getDateKey = (d) => {
      if (!d) return null;
      const dt = new Date(d);
      if (isNaN(dt)) return null;
      
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    const formatLabel = (isoKey) => {
      const dt = new Date(isoKey);
      return dt.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Hitung jumlah per tanggal
    const countByDate = (data, dateKeyName) => {
      const counts = {};
      data.forEach((item) => {
        const dateVal = item[dateKeyName] || item.uploaded_at || item.tanggal;
        const key = getDateKey(dateVal);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      return counts;
    };

    const filesCount = countByDate(filesData, 'uploaded_at');
    const planningCount = countByDate(planningData, 'uploaded_at');
    const organizingCount = countByDate(organizingData, 'uploaded_at');
    const videoCount = countByDate(videoData, 'tanggal');
    const fotoCount = countByDate(fotoData, 'uploaded_at');

    const allKeys = Array.from(
      new Set([
        ...Object.keys(filesCount),
        ...Object.keys(planningCount),
        ...Object.keys(organizingCount),
        ...Object.keys(videoCount),
        ...Object.keys(fotoCount),
      ])
    ).sort();

    const labels = allKeys.map(formatLabel);
    const fileValues = allKeys.map((k) => filesCount[k] || 0);
    const planningValues = allKeys.map((k) => planningCount[k] || 0);
    const organizingValues = allKeys.map((k) => organizingCount[k] || 0);
    const videoValues = allKeys.map((k) => videoCount[k] || 0);
    const fotoValues = allKeys.map((k) => fotoCount[k] || 0);

    if (labels.length === 0) {
      setChartData(null);
      return;
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Upload File",
          data: fileValues,
          backgroundColor: "rgba(59,130,246,0.75)", 
          borderRadius: 6,
        },
        {
          label: "Upload Planning",
          data: planningValues,
          backgroundColor: "rgba(16,185,129,0.75)", 
          borderRadius: 6,
        },
        {
          label: "Upload Organizing",
          data: organizingValues,
          backgroundColor: "rgba(234,179,8,0.75)", 
          borderRadius: 6,
        },
        {
          label: "Upload Video",
          data: videoValues,
          backgroundColor: "rgba(239,68,68,0.75)", 
          borderRadius: 6,
        },
        {
          label: "Upload Foto",
          data: fotoValues,
          backgroundColor: "rgba(249,115,22,0.85)", 
          borderRadius: 6,
        },
      ],
    });
  };

  const deleteUser = async (id, username) => {
    if (window.confirm(`Hapus user ${username}?`)) {
      try {
        await axios.delete(`${API_BASE}/api/users/${id}`, getAuthHeader());
        alert(`🗑️ User ${username} dihapus`);
        fetchUsers();
      } catch (err) {
        console.error("Gagal menghapus user:", err);
        alert("Gagal menghapus user. Pastikan Anda memiliki hak akses.");
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
            fetchFoto(),
          ]);

        buildCombinedChart(filesData, planningData, organizingData, videoData, fotoData);
        await fetchUsers();
      } catch (err) {
        console.error("Error loading dashboard data", err);
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
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </header>

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
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Grafik Upload per Tanggal</h2>
            {loading ? (
              <p className="text-gray-500">Memuat data grafik...</p>
            ) : !chartData || chartData.labels.length === 0 ? (
              <p className="text-gray-500">Belum ada data upload.</p>
            ) : (
              // PERBAIKAN: Gunakan class Tailwind untuk tinggi responsif & hapus style inline statis
              <div className="relative w-full h-[300px] md:h-[400px]">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // PENTING: Agar grafik mengikuti tinggi container
                    plugins: {
                      legend: { 
                        display: true, 
                        position: "top",
                        labels: {
                            boxWidth: 12, // Perkecil kotak warna legenda
                            font: { size: 11 } // Perkecil font legenda di mobile
                        }
                      },
                      title: { display: false },
                    },
                    scales: {
                      x: { 
                        grid: { display: false },
                        ticks: {
                            font: { size: 10 }, // Font sumbu X lebih kecil agar muat
                            maxRotation: 45,    // Miringkan teks jika terlalu panjang
                            minRotation: 0
                        }
                      },
                      y: { 
                        beginAtZero: true, 
                        ticks: { 
                            precision: 0,
                            font: { size: 10 } 
                        } 
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Data User (Khusus Superadmin) */}
          {isSuperAdmin && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Daftar User Aktif</h2>
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
                    {users.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-4 text-gray-500">Belum ada user.</td></tr>
                    ) : (
                        users.map((user, index) => (
                        <tr key={user.id_user || user.id}>
                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 capitalize">{user.level}</td>
                            <td className="px-6 py-4 text-sm">
                            <button
                                onClick={() => deleteUser(user.id_user || user.id, user.username)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-2"
                            >
                                Hapus
                            </button>
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
            <p className="tracking-wide">
              © Copyright <span className="font-bold">GAZEBO CODING 2025</span> All Rights Reserved
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;