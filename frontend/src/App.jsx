// frontend/src/App.jsx
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
import Foto from "./pages/admin/foto.jsx";
import DetailFoto from "./pages/DetailFoto";

import RequireAuth from "./components/RequireAuth"; // <-- import

function App() {
  const adminRoles = ["admin", "superadmin"];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/actuating/video/:id" element={<DetailVideo />} />
        <Route path="/actuating/foto/:id" element={<DetailFoto />} />

        {/* route untuk pengajuan akun mungkin boleh diakses admin only juga */}
        <Route
          path="/admin/pengajuan-akun"
          element={
            <RequireAuth allowedRoles={adminRoles}>
              <DaftarPengajuanAkun />
            </RequireAuth>
          }
        />

        {/* contoh: semua route /admin/... dibungkus RequireAuth */}
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
