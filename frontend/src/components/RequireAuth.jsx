// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // ambil user dari localStorage (seperti yang disimpan di login.jsx)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }

  // jika tidak login -> arahkan ke /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // kalau ada tetapi level tidak diizinkan -> arahkan ke /login juga
  // (kamu bisa ganti redirect ke halaman lain seperti '/' jika mau)
  const level = user.level || user.role || user?.level; // fleksibel
  if (!allowedRoles.includes(level)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // semua oke -> render children
  return children;
};

export default RequireAuth;