import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaSignOutAlt,
  FaClipboardList,
  FaBars,
  FaChevronLeft,
  FaChevronDown,
  FaChevronRight,
  FaVideo,
  FaCamera,
  FaProjectDiagram,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaTimes,
  FaExternalLinkAlt, // <-- Tambahkan ikon ini
} from "react-icons/fa";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [actuatingOpen, setActuatingOpen] = useState(false);
  const [user, setUser] = useState(null);
  const flyoutRef = useRef(null);

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user || parsedUser);
    }
  }, []);

  const isSuperAdmin = user?.level === "superadmin";

  const navLinks = [
    { to: "/admin/admin", icon: FaTachometerAlt, text: "Dashboard" },
    ...(isSuperAdmin
      ? [{ to: "/admin/pengajuan-akun", icon: FaUsers, text: "Manajemen User" }]
      : []),
    { to: "/admin/files", icon: FaFileAlt, text: "Manajemen File" },
    { to: "/admin/planning", icon: FaClipboardList, text: "Planning" },
    { to: "/admin/organizing", icon: FaProjectDiagram, text: "Organizing" },
    { to: "/admin/controlling", icon: FaClipboardCheck, text: "Controlling" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setActuatingOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  return (
    <>
      <aside
        className={`${collapsed ? "w-20" : "w-72"} group fixed md:static inset-y-0 left-0 z-40 flex h-screen flex-col
        bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200
        shadow-2xl ring-1 ring-slate-700/40 transition-all duration-300`}
      >
        {/* === Brand / Toggle === */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-end" : "justify-between"
          } px-4 py-4 border-b border-white/5`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/20 grid place-items-center ring-1 ring-indigo-400/30">
                <span className="font-black text-indigo-300">Si</span>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-wide">Sikoltridi</p>
                <p className="text-xs text-slate-400 -mt-1">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="text-slate-300/80 hover:text-white rounded-lg p-2 transition"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <FaBars /> : <FaChevronLeft />}
          </button>
        </div>

        {/* === Navigation === */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* --- TOMBOL LIHAT SITUS DITAMBAHKAN DI SINI --- */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Lihat Situs"
            className="relative flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/5 hover:shadow-inner text-slate-300"
          >
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-lg transition bg-transparent"
            />
            <div
              className="grid place-items-center h-9 w-9 rounded-lg transition bg-white/5 text-slate-300"
            >
              <FaExternalLinkAlt size={18} />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium tracking-wide">
                Lihat Situs
              </span>
            )}
          </a>
          {/* ------------------------------------------- */}

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                title={link.text}
                className={({ isActive }) =>
                  [
                    "relative flex items-center gap-3 rounded-xl px-3 py-3 transition",
                    "hover:bg-white/5 hover:shadow-inner",
                    isActive
                      ? "bg-indigo-500/10 text-white ring-1 ring-indigo-400/30"
                      : "text-slate-300",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-lg transition ${
                        isActive ? "bg-indigo-400" : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`grid place-items-center h-9 w-9 rounded-lg transition ${
                        isActive
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-white/5 text-slate-300"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    {!collapsed && (
                      <span className="text-sm font-medium tracking-wide">
                        {link.text}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* === Actuating (submenu) === */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActuatingOpen((v) => !v)}
              className={`w-full relative flex items-center gap-3 rounded-xl px-3 py-3 transition
                hover:bg-white/5 hover:shadow-inner text-left
                ${
                  actuatingOpen
                    ? "bg-indigo-500/10 text-white ring-1 ring-indigo-400/30"
                    : "text-slate-300"
                }`}
              title="Actuating"
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-lg transition ${
                  actuatingOpen ? "bg-indigo-400" : "bg-transparent"
                }`}
              />
              <div
                className={`grid place-items-center h-9 w-9 rounded-lg transition ${
                  actuatingOpen
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-white/5 text-slate-300"
                }`}
              >
                <FaClipboardList size={18} />
              </div>
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium tracking-wide">
                    Actuating
                  </span>
                  <span className="opacity-80">
                    {actuatingOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
              )}
            </button>
            {!collapsed && actuatingOpen && (
              <div className="mt-1 ml-12 space-y-1">
                <NavLink
                  to="/admin/actuating/video"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`
                  }
                >
                  <FaVideo className="opacity-80" />
                  <span>Video</span>
                </NavLink>
                <NavLink
                  to="/admin/actuating/foto"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`
                  }
                >
                  <FaCamera className="opacity-80" />
                  <span>Foto</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* === Footer === */}
        <div className="mt-auto border-t border-white/5 px-3 py-3">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } gap-3`}
          >
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img
                  src="https://placehold.co/36x36?text=A"
                  alt="Admin"
                  className="h-9 w-9 rounded-full ring-1 ring-white/10"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{user?.username || "Admin"}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.level || "level"}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-200 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              <FaSignOutAlt />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MODAL KONFIRMASI LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 mx-4 bg-slate-800 rounded-2xl shadow-lg ring-1 ring-white/10">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="grid w-16 h-16 mb-4 text-yellow-400 bg-yellow-400/10 rounded-full place-items-center ring-8 ring-yellow-400/20">
                <FaExclamationTriangle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Konfirmasi Logout</h2>
              <p className="text-slate-300 mb-8">
                Apakah Anda yakin ingin keluar dari Admin Panel?
              </p>
              <div className="flex justify-center w-full gap-4">
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  className="w-full px-6 py-3 font-semibold text-white transition bg-slate-600 rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarAdmin;