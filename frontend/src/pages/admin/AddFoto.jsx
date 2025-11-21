import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CREATE_ENDPOINT = `${API_BASE}/api/foto`;

export default function AddFoto({ open, onClose, onSuccess }) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fotoRef = useRef(null);

  if (!open) return null;

  const resetForm = () => {
    setJudul("");
    setDeskripsi("");
    setFoto(null);
    if (fotoRef.current) fotoRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim()) return alert("Judul wajib diisi.");
    if (!foto) return alert("File foto wajib diunggah.");

    const fd = new FormData();
    fd.append("judul", judul.trim());
    fd.append("deskripsi", deskripsi.trim());
    fd.append("foto", foto);

    setSubmitting(true);
    try {
      await axios.post(CREATE_ENDPOINT, fd, { withCredentials: true });
      resetForm();
      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          resetForm();
          onClose?.();
        }}
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Upload Foto</h2>
          <button
            onClick={() => {
              resetForm();
              onClose?.();
            }}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Judul</label>
            <input
              type="text"
              placeholder="Masukkan judul foto"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              placeholder="Tambahkan deskripsi singkat foto"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Upload Foto (JPG/PNG)</label>
            <input
              ref={fotoRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
              className="w-full rounded border px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {submitting ? "Mengunggah…" : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose?.();
              }}
              className="px-5 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}