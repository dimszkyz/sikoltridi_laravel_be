import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';

// 1. Definisi URL Backend Laravel
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://sikoltridi.id";

const DetailVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      try {
        setLoading(true);
        
        // 2. Perbaiki Endpoint GET Video (Jamak)
        const videoResponse = await axios.get(`${API_BASE}/api/videos/${id}`);
        // Laravel membungkus detail dalam { data: ... }
        setVideo(videoResponse.data.data || videoResponse.data);

        // 3. Perbaiki Endpoint GET Komentar (komentar-video)
        const commentsResponse = await axios.get(`${API_BASE}/api/komentar-video/${id}`);
        setComments(commentsResponse.data);
        
      } catch (err) {
        console.error("Error fetching details:", err);
        setError('Gagal memuat detail video atau komentar.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userId = user?.id_user || user?.id;

    if (!user || !userId) {
      alert('Anda harus login untuk berkomentar.');
      navigate('/login');
      return;
    }

    try {
      // 4. Perbaiki logic POST Komentar
      // - Gunakan endpoint /api/komentar-video
      // - Ambil Token dari localStorage
      // - Kirim Token di Header
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_BASE}/api/komentar-video`, {
        id_video: id,
        // id_user tidak perlu dikirim manual jika backend pakai Auth::user(), 
        // tapi jika backend Anda masih butuh 'id_user', biarkan saja.
        id_user: userId, 
        isi_komentar: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Perbarui state komentar (tambah komentar baru ke atas/bawah)
      // response.data biasanya { message: "...", data: { ...komentar_baru... } }
      // Kita perlu cek format respon backend Anda.
      // Jika backend hanya return { message: "..." }, Anda harus refresh manual atau backend harus return data komentar.
      // Asumsi backend return standard Laravel resource.
      
      // Agar aman, kita fetch ulang atau append manual
      // Append manual sederhana:
      const newCommentData = {
        id: Date.now(), // temp id
        id_video: id,
        id_user: userId,
        isi_komentar: newComment,
        tanggal: new Date().toISOString(),
        username: user.username
      };
      
      setComments([newCommentData, ...comments]);
      setNewComment('');
      
    } catch (err) {
      console.error('Gagal mengirim komentar:', err);
      alert('Terjadi kesalahan saat mengirim komentar. Pastikan Anda sudah Login.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Memuat video dan komentar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Video tidak ditemukan.</p>
      </div>
    );
  }

  const formattedDate = new Date(video.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // 5. URL Media yang Benar
  const videoSrc = `${API_BASE}/uploads/video/${video.media}`;
  const thumbSrc = video.thumbnail ? `${API_BASE}/uploads/video/thumb/${video.thumbnail}` : null;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pt-24 py-10 px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* === Video Player === */}
          <div className="bg-black rounded-xl shadow-lg overflow-hidden">
            <video 
              className="w-full aspect-video" 
              controls 
              poster={thumbSrc} 
              key={video.id}
            >
              {/* Gunakan URL absolut ke Backend */}
              <source src={videoSrc} type="video/mp4" />
              Browser Anda tidak mendukung tag video.
            </video>
          </div>

          {/* === Detail Informasi === */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">{video.judul}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>Diupload pada {formattedDate}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{video.keterangan}</p>
          </div>

          {/* === Komentar === */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Komentar ({comments.length})
            </h2>

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment, idx) => (
                  <div key={comment.id || idx} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-gray-800">
                        {comment.username || "Pengguna"}{' '}
                      </p>
                      <span className="text-xs text-gray-500">
                        {comment.tanggal ? new Date(comment.tanggal).toLocaleString('id-ID') : "Baru saja"}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm break-words">{comment.isi_komentar}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
            )}
          </div>
        </div>

        {/* === Input Komentar === */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg py-3 px-4">
          <form onSubmit={handleCommentSubmit} className="max-w-4xl mx-auto flex items-center space-x-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? `Tulis komentar sebagai ${user.username}...` : 'Login untuk menulis komentar...'}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-gray-400 focus:border-gray-400 text-gray-800 bg-gray-50 resize-none"
              rows="1"
              disabled={!user}
            />
            <button
              type="submit"
              className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400"
              disabled={!user}
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DetailVideo;