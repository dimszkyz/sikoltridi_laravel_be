// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Kirim ke logging/Sentry kalau perlu
    // console.error("Boundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl border bg-white p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">Terjadi kesalahan</h2>
            <p className="text-sm text-slate-600 mb-4">
              Maaf, ada error saat menampilkan halaman ini.
            </p>
            <pre className="text-xs bg-slate-50 p-3 rounded overflow-auto max-h-40">
              {String(this.state.error?.message || this.state.error || "Unknown error")}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
