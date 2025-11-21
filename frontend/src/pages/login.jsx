import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      });

      console.log('Data dari Server:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
      window.location.reload();

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login gagal. Periksa kembali username dan password Anda.');
      } else {
        setError('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
      }
    }
  };

  return (
    // Wrapper utama untuk layout flex column
    // --- TAMBAHKAN 'relative' DI SINI ---
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      
      {/* --- TOMBOL KEMBALI PINDAH KE SINI --- */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
      {/* ------------------------------------- */}

      {/* Konten utama yang akan mengisi ruang tersedia */}
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
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
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
          
          {/* --- TOMBOL KEMBALI DIHAPUS DARI SINI --- */}
          
        </div>
      </main>

      {/* Footer yang Anda berikan */}
      <footer className="bg-white text-black text-center py-4 border-t border-gray-200">
        <p className="text-sm tracking-wide">
          © Copyright <span className="font-bold">GAZEBO TECH 2025</span> All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Login;