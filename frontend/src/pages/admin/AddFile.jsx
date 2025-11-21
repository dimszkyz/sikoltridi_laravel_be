import React, { useState, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CREATE_ENDPOINT = `${API_BASE}/api/files`;

export default function AddFileModal({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pdfRef = useRef(null);

  if (!open) return null;

  const resetForm = () => {
    setTitle("");
    setPdfFile(null);
    setPreviewUrl("");
    if (pdfRef.current) pdfRef.current.value = "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("File harus berformat PDF!");
      setPdfFile(null);
      return;
    }
    setPdfFile(file);

    // Buat preview halaman pertama
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      try {
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        const page = await pdf.getPage(1);
        const scale = 1.0;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;
        setPreviewUrl(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Gagal membuat preview PDF:", err);
        setPreviewUrl("");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Judul wajib diisi!");
    if (!pdfFile) return alert("File PDF wajib diunggah!");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("pdf_file", pdfFile);

    // Tambahkan preview sebagai image_file
    if (previewUrl.startsWith("data:image")) {
      const blob = await (await fetch(previewUrl)).blob();
      const imageFile = new File([blob], `${pdfFile.name.replace(/\.pdf$/, ".png")}`, {
        type: "image/png",
      });
      fd.append("image_file", imageFile);
    }

    setSubmitting(true);
    try {
      await axios.post(CREATE_ENDPOINT, fd);
      resetForm();
      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah file.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          resetForm();
          onClose?.();
        }}
      />

      {/* Modal content */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Tambah File Baru</h2>
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
            <label className="text-sm font-medium">Judul File</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul file"
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Upload File PDF</label>
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full rounded border px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2"
            />
          </div>

          {previewUrl && (
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Preview Halaman 1</h3>
              <img
                src={previewUrl}
                alt="Preview PDF"
                className="border rounded shadow-sm mx-auto"
                style={{ width: "180px", height: "auto" }}
              />
              <p className="text-xs text-gray-600 mt-1">{pdfFile?.name}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Mengunggah…" : "Simpan"}
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
