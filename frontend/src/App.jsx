// frontend/src/App.jsx
import React, { useEffect } from "react"; // Tambahkan import React & useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Admin from "./pages/admin/admin";
import DaftarFile from "./pages/admin/DaftarFile";
import DaftarPengajuanAkun from "./pages/admin/DaftarPengajuanAkun";
import AddFile from "./pages/admin/AddFile";
import AddPlanning from "./pages/admin/AddPlanning";
import Planning from "./pages/admin/Planning";
import Organizing from "./pages/admin/Organizing";
import AddOrganizing from "./pages/admin/AddOrganizing";
import PartControlling from "./pages/PartControlling";
import ControllingAdmin from "./pages/admin/Controlling";
import DetailVideo from "./pages/DetailVideo";
import Video from "./pages/admin/video.jsx";
import Foto from "./pages/admin/Foto.jsx";
import DetailFoto from "./pages/DetailFoto";

import RequireAuth from "./components/RequireAuth";

function App() {
  const adminRoles = ["admin", "superadmin"];

  // --- TAMBAHAN LOGIKA AUTO LOGOUT (3 JAM) ---
  useEffect(() => {
    // 3 jam = 3 * 60 * 60 * 1000 ms
    const SESSION_TIMEOUT = 3 * 60 * 60 * 1000; 

    const checkSession = () => {
      const lastActive = localStorage.getItem("lastActive");
      const token = localStorage.getItem("token");

      // Cek hanya jika user sedang login
      if (token && lastActive) {
        const now = Date.now();
        const timeDiff = now - parseInt(lastActive, 10);

        // Jika selisih waktu > 3 jam, logout paksa
        if (timeDiff > SESSION_TIMEOUT) {
          localStorage.clear(); // Hapus token & lastActive
          alert("Sesi Anda telah berakhir karena tidak aktif lebih dari 3 jam. Silakan login kembali.");
          window.location.href = "/login";
        }
      }
    };

    const updateActivity = () => {
      if (localStorage.getItem("token")) {
        localStorage.setItem("lastActive", Date.now());
      }
    };

    // Cek saat pertama kali load
    checkSession();
    updateActivity();

    // Cek setiap 1 menit (interval)
    const intervalId = setInterval(checkSession, 60 * 1000);

    // Reset timer jika user aktif (klik/ketik/gerak mouse)
    window.addEventListener("click", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("scroll", updateActivity);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, []);
  // ------------------------------------------------

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/actuating/video/:id" element={<DetailVideo />} />
        <Route path="/actuating/foto/:id" element={<DetailFoto />} />

        <Route
          path="/admin/pengajuan-akun"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <DaftarPengajuanAkun />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/admin"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/files"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <DaftarFile />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/files/add"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <AddFile />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/planning/add"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <AddPlanning />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/planning"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <Planning />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/organizing"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <Organizing />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/organizing/add"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <AddOrganizing />
            </RequireAuth>
          }
        />

        <Route path="/controlling" element={<PartControlling />} />
        <Route
          path="/admin/controlling"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <ControllingAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/actuating/video"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <Video />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/actuating/foto"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <Foto />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;