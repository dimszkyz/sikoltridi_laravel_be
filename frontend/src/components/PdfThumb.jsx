// src/components/PdfThumb.jsx
import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // worker utk Vite/CRA

/**
 * Render thumbnail dari halaman pertama PDF.
 * Props:
 *  - url: string (URL ke file PDF)
 *  - width: number (lebar thumbnail, default 180)
 *  - className: string (opsional)
 */
export default function PdfThumb({ url, width = 180, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Ambil dokumen PDF dari URL
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled) return;

        // Ambil halaman pertama
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        // Siapkan canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render ke canvas
        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
      } catch (e) {
        // Kalau gagal render, kosongkan canvas (akan tampak placeholder CSS)
        const c = canvasRef.current;
        if (c) {
          const ctx = c.getContext("2d");
          ctx.clearRect(0, 0, c.width, c.height);
        }
        // console.warn("Gagal render PDF thumb:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, width]);

  return (
    <div className={`relative ${className}`} style={{ width }}>
      <div className="absolute inset-0 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-lg select-none">
        No Preview
      </div>
      <canvas ref={canvasRef} className="relative z-[1] rounded shadow-sm" />
    </div>
  );
}
