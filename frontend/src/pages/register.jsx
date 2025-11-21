import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// 1. Impor ikon
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  
  // --- STATE SESUAI URUTAN BARU ---
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [jabatan, setJabatan] = useState(""); // Default kosong untuk dropdown
  const [nipNik, setNipNik] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim semua data state ke backend
      const res = await axios.post("http://localhost:5000/api/users/pengajuan-akun", {
        username,
        password,
        nama_lengkap: namaLengkap, // Pastikan key sesuai dengan backend
        jabatan: jabatan,
        nip_nik: nipNik,
      });

      alert(res.data.msg || "Pengajuan akun berhasil, tunggu persetujuan admin!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Terjadi kesalahan saat mengajukan akun");
    } finally {
      setLoading(false);
    }
  };

  // Variabel untuk mengecek apakah NIP/NIK perlu ditampilkan
  const showNipNik = ['kepsek', 'guru', 'dudi'].includes(jabatan);

  return (
    // Menggunakan layout flex column agar footer menempel di bawah
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Konten utama dibuat 'flex-grow' untuk mengisi ruang */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">Daftar Akun</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* 1. USERNAME */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* 2. NAMA LENGKAP */}
            <div>
              <label 
                htmlFor="namaLengkap" 
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                id="namaLengkap"
                type="text"
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama lengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
              />
            </div>

            {/* 3. PASSWORD */}
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
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* 4. JABATAN (DROPDOWN) */}
            <div>
              <label 
                htmlFor="jabatan" 
                className="block text-sm font-medium text-gray-700"
              >
                Jabatan
              </label>
              <select
                id="jabatan"
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                required
              >
                <option value="" disabled>Pilih Jabatan...</option>
                <option value="kepsek">Kepala Sekolah</option>
                <option value="guru">Guru</option>
                <option value="orangtua">Orang Tua</option>
                <option value="dudi">DUDI (Dunia Usaha/Industri)</option>
              </select>
            </div>

            {/* 5. NIP / NIK (KONDISIONAL) */}
            {showNipNik && (
              <div>
                <label 
                  htmlFor="nipNik" 
                  className="block text-sm font-medium text-gray-700"
                >
                  NIP / NIK
                </label>
                <input
                  id="nipNik"
                  type="text"
                  className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan NIP/NIK Kepegawaian"
                  value={nipNik}
                  onChange={(e) => setNipNik(e.target.value)}
                  required // NIP/NIK wajib diisi jika jabatannya dipilih
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-blue-700 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Ajukan Akun"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </main>
      
      {/* Footer ditambahkan di sini */}
      <footer className="bg-white text-black text-center py-4 border-t border-gray-200">
        <p className="text-sm tracking-wide">
          © Copyright <span className="font-bold">GAZEBO TECH 2025</span> All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Register;