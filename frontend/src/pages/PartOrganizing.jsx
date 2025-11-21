// src/pages/PartOrganizing.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // wajib agar pdf.js bisa render

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Ukuran kotak abu-abu (card) tempat thumbnail PDF
const THUMB_W = 300; // mengikuti w-[300px]
const THUMB_H = 400; // mengikuti h-[400px]

const PartOrganizing = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const canvasRefs = useRef({}); // simpan ref canvas per file

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/organizing`);
        setFiles(response.data.data || []);
      } catch (err) {
        setError("Gagal memuat data organizing. Pastikan server backend berjalan.");
        console.error("Error fetching organizing:", err);
      }
    };
    fetchFiles();
  }, []);

  // Render PDF menutupi kotak (object-fit: cover) dan di-crop dari kiri (align-left)
  const renderPdfCoverAlignLeft = async (url, canvas) => {
    const pdf = await pdfjsLib.getDocument(url).promise;
    const page = await pdf.getPage(1);

    // Dapatkan rasio asli
    const base = page.getViewport({ scale: 1 });
    const scale = Math.max(THUMB_W / base.width, THUMB_H / base.height);

    // Render ke offscreen canvas
    const vp = page.getViewport({ scale });
    const off = document.createElement("canvas");
    off.width = Math.ceil(vp.width);
    off.height = Math.ceil(vp.height);
    const offCtx = off.getContext("2d");
    await page.render({ canvasContext: offCtx, viewport: vp }).promise;

    // Pindah ke canvas tampilan berukuran tetap
    canvas.width = THUMB_W;
    canvas.height = THUMB_H;
    const ctx = canvas.getContext("2d");

    // Crop dari kiri; vertikal ditengah jika tinggi berlebih
    const sx = 0; // align-left
    const sy = Math.max(0, Math.floor((off.height - THUMB_H) / 2));
    const sWidth = Math.min(THUMB_W, off.width - sx);
    const sHeight = Math.min(THUMB_H, off.height - sy);

    ctx.clearRect(0, 0, THUMB_W, THUMB_H);
    ctx.drawImage(off, sx, sy, sWidth, sHeight, 0, 0, THUMB_W, THUMB_H);
  };

  useEffect(() => {
    const renderThumbnails = async () => {
      for (const file of files) {
        const canvas = canvasRefs.current[file.id];
        if (!canvas) continue;
        try {
          const url = `${API_BASE}/uploads/organizing/${file.pdf_file}`;
          await renderPdfCoverAlignLeft(url, canvas);
        } catch (err) {
          console.error(`Gagal render thumbnail untuk ${file.title}:`, err);
        }
      }
    };
    if (files.length > 0) renderThumbnails();
  }, [files]);

  const handleOpenPDF = (pdfFile) => {
    window.open(`${API_BASE}/uploads/organizing/${pdfFile}`, "_blank");
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Organizing</h2>
          <div className="w-16 h-[2px] bg-blue-500 mx-auto my-2"></div>
          <p className="text-gray-600">Struktur Kepanitiaan</p>
        </div>

        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
        )}

        {/* Rata kiri jika hanya 1 media, selain itu tetap tengah */}
        <div
          className={`flex flex-wrap gap-6 ${
            files.length === 1 ? "justify-start" : "justify-center"
          }`}
        >
          {files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="relative overflow-hidden rounded-md shadow-md group cursor-pointer w-[300px]"
                onClick={() => handleOpenPDF(file.pdf_file)}
              >
                {/* Kotak abu-abu: tanpa centering supaya mulai dari kiri */}
                <div className="bg-gray-200 w-full h-[400px] rounded-md overflow-hidden">
                  <canvas
                    ref={(el) => (canvasRefs.current[file.id] = el)}
                    className="block w-[300px] h-[400px]" // penuhi kotak
                  />
                </div>

                {/* Judul muncul saat hover */}
                <div className="absolute left-1/2 bottom-[15px] transform -translate-x-1/2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-black/70 px-3 py-[5px] rounded-full">
                    <h3 className="text-white text-sm font-semibold text-center whitespace-nowrap">
                      {file.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !error && (
              <p className="text-gray-500 text-center col-span-full">
                Tidak ada dokumen organizing yang tersedia.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PartOrganizing;
