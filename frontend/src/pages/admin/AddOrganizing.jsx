// src/pages/admin/AddOrganizing.jsx
import React, { useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CREATE_ENDPOINT = `${API_BASE}/api/organizing`; // 🔹 endpoint khusus Organizing

export default function AddOrganizing({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pdfRef = useRef(null);

  if (!open) return null;

  const resetForm = () => {
    setTitle("");
    setPdfFile(null);
    if (pdfRef.current) pdfRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Judul dokumen wajib diisi.");
    if (!pdfFile) return alert("File PDF wajib diunggah.");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("pdf_file", pdfFile); // hanya PDF, tidak ada image

    setSubmitting(true);
    try {
      await axios.post(CREATE_ENDPOINT, fd, { withCredentials: true });
      resetForm();
      onClose?.();
      onSuccess?.(); // refresh tabel parent (Organizing.jsx)
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah data organizing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          resetForm();
          onClose?.();
        }}
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Upload Dokumen Organizing</h2>
          <button
            onClick={() => {
              resetForm();
              onClose?.();
            }}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Judul Dokumen</label>
            <input
              type="text"
              placeholder="Masukkan judul dokumen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Upload Dokumen PDF</label>
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
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
