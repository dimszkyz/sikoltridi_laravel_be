import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setShowDropdown(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "#home", label: "Home" },
    { to: "#partfile", label: "File" },
    { to: "#PartPlanning", label: "Planning" },
    { to: "#PartOrganizing", label: "Organizing" },
    { to: "#PartMedia", label: "Actuating" },
    { to: "/controlling", label: "Controlling", isRoute: true },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user || parsedUser);
      console.log("Data user di Navbar:", parsedUser.user || parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const smoothScrollTo = (hash) => {
    const el = document.querySelector(hash);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const goHomeWithHash = (hash) => {
    navigate({ pathname: "/", hash: hash.slice(1) });
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    if (item.isRoute) {
      navigate(item.to);
      return;
    }
    const onHome = location.pathname === "/";
    if (onHome) smoothScrollTo(item.to);
    else goHomeWithHash(item.to);
  };

  const isAdmin = user && (user.level === "admin" || user.level === "superadmin");

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex justify-center py-3">
      <nav className="w-[92%] max-w-7xl bg-white/90 backdrop-blur-md rounded-full shadow-lg px-5 md:px-8 py-2.5 flex items-center justify-between">
        {/* ===== TEKS SIKOLTRIDI SEBAGAI BRAND ===== */}
        <a
          href="/#home"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname === "/") smoothScrollTo("#home");
            else goHomeWithHash("#home");
          }}
          className="text-[22px] md:text-2xl font-semibold text-slate-800 select-none cursor-pointer"
        >
          Sikoltridi
        </a>


        {/* Menu desktop */}
        <ul className="hidden md:flex items-center gap-8 text-slate-700">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.isRoute ? item.to : `/${item.to}`}
                onClick={(e) => handleClick(e, item)}
                className="font-medium transition hover:text-blue-600 cursor-pointer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Tombol kanan (Login / Dropdown user) */}
        <div className="hidden md:flex items-center relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition shadow-sm"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="user"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-sm font-medium text-slate-800 capitalize">
                  {user?.username} ({user?.level})
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-blue-50 text-slate-700 rounded-xl shadow-lg py-2 animate-fadeIn">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate("/admin/admin")}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-md transition"
                      >
                        🛠️ Admin Panel
                      </button>
                      <hr className="my-1 border-blue-100" />
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-blue-100 hover:text-red-600 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition shadow">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Hamburger menu (mobile) */}
        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-slate-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" />
          </svg>
        </button>
      </nav>

      {/* Menu dropdown mobile */}
      <div
        className={`md:hidden fixed left-1/2 -translate-x-1/2 top-[76px] w-[92%] max-w-7xl transition-all duration-300 ${open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.isRoute ? item.to : `/${item.to}`}
              onClick={(e) => handleClick(e, item)}
              className="block px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition cursor-pointer"
            >
              {item.label}
            </a>
          ))}
          <hr className="my-2 border-slate-200" />
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin/admin")}
                  className="block w-full text-left px-3 py-2 rounded-xl text-blue-700 font-medium hover:bg-blue-50 transition"
                >
                  🛠️ Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-xl text-red-500 font-medium hover:bg-red-50 transition"
              >
                Logout ({user?.username})
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-left px-3 py-2 rounded-xl font-medium text-blue-600 hover:bg-blue-50 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
