import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, BrowserRouter, useInRouterContext } from 'react-router-dom';

// --- Komponen Internal: Form Login ---
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://sikoltridi.sidome.id/api/login', {
        username,
        password,
      });

      console.log('Data dari Server:', response.data);

      // Simpan token agar bisa dipakai saat upload file
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Simpan data user
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      navigate('/');
      window.location.reload();

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data) {
        // Pastikan error yang ditampilkan adalah string
        const msg = err.response.data.message || 'Login gagal. Periksa kembali username dan password Anda.';
        setError(String(msg));
      } else {
        setError('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
      }
    }
  };

  // Ikon Mata (Show) - SVG Langsung
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Ikon Mata Dicoret (Hide) - SVG Langsung
  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      
      {/* Tombol Kembali */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </main>

      <footer className="bg-white text-black text-center py-4 border-t border-gray-200">
        <p className="text-sm tracking-wide">
          © Copyright <span className="font-bold">GAZEBO TECH 2025</span> All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

// --- Komponen Wrapper: Menangani Router ---
// Ini memastikan Login bisa berjalan di App.jsx (yang sudah ada Router)
// MAUPUN berjalan sendiri di Preview (yang belum ada Router)
const Login = () => {
  // Cek apakah kita sudah ada di dalam Router
  let inRouter = false;
  try {
    inRouter = useInRouterContext();
  } catch (e) {
    inRouter = false;
  }

  if (inRouter) {
    return <LoginForm />;
  }

  // Jika tidak ada Router (misal di Preview), bungkus dengan BrowserRouter
  return (
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

export default Login;