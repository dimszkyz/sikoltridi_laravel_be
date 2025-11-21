import React, { useMemo, useState } from "react";
import axios from "axios";
// import Navbar from "../components/navbar"; // <-- DIHILANGKAN

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const SCALE = ["Sangat Baik", "Baik", "Cukup", "Kurang", "Sangat Kurang"];

// ---------- PERTANYAAN ----------
const QUESTIONS_A = [
  "Implementasi desain model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Keterpaduan tiga komponen Tripusat Pendidikan dalam penyelenggaraan Pendidikan Kewirausahaan bagi anak usia dini berbasis kolaborasi tripusat pendidikan.",
  "Proses kolaborasi sekolah, orang tua dan DUDI yang meliputi tahap perencanaan (planning), pengorganisasian (organizing), pelaksanaan (actuating) dan pengawasan/evaluasi (controlling).",
  "Implementasi tahap perencanaan (planning) model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Implementasi tahap pengorganisasian (organizing) model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Implementasi tahap pelaksanaan (actuating) model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Implementasi tahap pengawasan/evaluasi (controlling) model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Ketercapaian tujuan Pendidikan Kewirausahaan bagi anak usia dini.",
  "Pelaksanaan pembelajaran kewirausahaan dengan metode Simulasi Kewirausahaan Anak Usia Dini (SIKADI).",
  "Prospek dampak/outcome pada anak setelah melakukan pembelajaran kewirausahaan dengan metode Simulasi Kewirausahaan Anak Usia Dini (SIKADI).",
];

const QUESTIONS_B = [
  "Kemudahan penggunaan Sistem Informasi Kolaborasi Tripusat Pendidikan (Sikoltridi) Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Kesesuaian konten (isi) Sikoltridi dengan kebutuhan dalam Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Kejelasan konten (isi) Sikoltridi dalam kebutuhan Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Kemudahan penggunaan Sikoltridi dalam kebutuhan Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan.",
  "Keterpaduan tiga komponen Tripusat Pendidikan (sekolah, orang tua, dan DUDI) dalam Sikoltridi.",
];

const QUESTIONS_C = [
  "Kemudahan sekolah dalam penyelenggaraan Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan dengan bantuan Sikoltridi.",
  "Kemudahan Kepala Sekolah, Guru dan DUDI dalam monitoring pelaksanaan pembelajaran (Kelas SIKADI).",
  "Kemudahan orang tua dalam memberikan respons/penilaian pada pelaksanaan pembelajaran (Kelas SIKADI).",
  "Kemudahan DUDI dalam memberikan respons/penilaian pada pelaksanaan pembelajaran (Kelas SIKADI).",
  "Kemudahan dalam penyimpanan dokumen pelaksanaan pembelajaran kewirausahaan (Kelas SIKADI).",
];

const QUESTIONS_D = [
  "Kelengkapan konten (isi) tahap perencanaan (planning) pada Sikoltridi.",
  "Kelengkapan konten (isi) tahap pengorganisasian (organizing) pada Sikoltridi.",
  "Kelengkapan konten (isi) tahap pelaksanaan (actuating) pada Sikoltridi.",
  "Kelengkapan konten (isi) tahap pengawasan/evaluasi (controlling) pada Sikoltridi.",
];

// ---------- KOMPONEN KECIL ----------
function Stepper({ step }) {
  const items = ["Identitas", "A", "B", "C", "D", "Selesai"];
  const progress = ((step - 1) / (items.length - 1)) * 100;
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 mt-2 mb-8">
      <div className="relative h-1.5 bg-gray-200 rounded-full">
        <div
          className="absolute h-1.5 bg-blue-600 rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        {items.map((label, idx) => (
          <span
            key={label}
            className={`${
              step - 1 >= idx ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuestionTable({
  prefix,
  title,
  questions,
  values,
  onChange,
  onBack,
  onNext,
  nextText,
  nextDisabled,
}) {
  const validate = () => questions.every((_, i) => values[`${prefix}${i + 1}`]);

  const handleNext = () => {
    if (!validate()) {
      const idx = questions.findIndex((_, i) => !values[`${prefix}${i + 1}`]);
      const key = `${prefix}${idx + 1}`;
      document
        .getElementById(`row-${key}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      alert("Mohon lengkapi semua jawaban terlebih dahulu.");
      return;
    }
    onNext?.();
  };

  return (
    <section className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto print:px-0">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">{title}</h2>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-4 py-3 w-12">No</th>
              <th className="px-4 py-3">Pertanyaan</th>
              {SCALE.map((h) => (
                <th key={h} className="px-3 py-3 text-center whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {questions.map((q, idx) => {
              const key = `${prefix}${idx + 1}`;
              return (
                <tr
                  id={`row-${key}`}
                  key={key}
                  className={idx % 2 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-4 py-3 align-top">{idx + 1}</td>
                  <td className="px-4 py-3 align-top">{q}</td>
                  {SCALE.map((opt) => (
                    <td key={opt} className="px-3 py-3 text-center align-top">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value={opt}
                          checked={values[key] === opt}
                          onChange={() => onChange(key, opt)}
                          className="h-4 w-4 accent-blue-600"
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Kembali
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={nextDisabled}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60"
          >
            {nextText}
          </button>
        </div>
      </div>
    </section>
  );
}

function SuccessView({ respondent, answers, onAgain }) {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-8 py-10">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 grid place-items-center h-14 w-14 rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-emerald-800">Terima kasih! Kuesioner berhasil terkirim.</h3>
        <p className="mt-2 text-emerald-800/80">
          Data Anda telah berhasil kami catat.
        </p>

        <div className="mt-6 text-left bg-white rounded-xl border p-5">
          <p className="font-semibold text-slate-800 mb-2">Ringkasan Identitas</p>
          <ul className="text-sm text-slate-700 space-y-1">
            <li><span className="w-24 inline-block text-slate-500">Nama</span>: {respondent.nama || "-"}</li>
            <li><span className="w-24 inline-block text-slate-500">Jabatan</span>: {respondent.jabatan || "-"}</li>
            <li><span className="w-24 inline-block text-slate-500">Lembaga</span>: {respondent.lembaga || "-"}</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Kembali ke Beranda
          </a>
          <button
            onClick={onAgain}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Isi Lagi
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------- HALAMAN UTAMA ----------
export default function PartControlling() {
  // 1=Identitas, 2=A, 3=B, 4=C, 5=D, 6=Sukses
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);

  const [respondent, setRespondent] = useState({
    nama: "",
    jabatan: "",
    lembaga: "",
  });

  const [answers, setAnswers] = useState(() => {
    const obj = {};
    QUESTIONS_A.forEach((_, i) => (obj[`a${i + 1}`] = ""));
    QUESTIONS_B.forEach((_, i) => (obj[`b${i + 1}`] = ""));
    QUESTIONS_C.forEach((_, i) => (obj[`c${i + 1}`] = ""));
    QUESTIONS_D.forEach((_, i) => (obj[`d${i + 1}`] = ""));
    return obj;
  });

  const setAnswer = (key, value) => setAnswers((p) => ({ ...p, [key]: value }));

  const nextFromIdentity = () => {
    if (!respondent.nama || !respondent.jabatan || !respondent.lembaga) {
      alert("Harap isi semua data responden terlebih dahulu!");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitAll = async () => {
    const payload = {
      nama_responden: respondent.nama,
      jabatan: respondent.jabatan,
      lembaga: respondent.lembaga,
      ...answers,
    };

    try {
      setSending(true);
      await axios.post(`${API_BASE}/api/kuesioner`, payload, {
        withCredentials: true,
      });
      setStep(6); // -> tampilkan halaman sukses
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Kirim kuesioner error:", err?.response || err);
      alert(
        `Gagal mengirim kuesioner: ${err?.response?.status || ""} ${err?.response?.statusText || ""}`
      );
    } finally {
      setSending(false);
    }
  };

  const resetAll = () => {
    setRespondent({ nama: "", jabatan: "", lembaga: "" });
    const cleared = {};
    [...Array(10)].forEach((_, i) => (cleared[`a${i + 1}`] = ""));
    [...Array(5)].forEach((_, i) => (cleared[`b${i + 1}`] = ""));
    [...Array(5)].forEach((_, i) => (cleared[`c${i + 1}`] = ""));
    [...Array(4)].forEach((_, i) => (cleared[`d${i + 1}`] = ""));
    setAnswers(cleared);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* <Navbar /> */} {/* <-- DIHILANGKAN */}

      {/* Ubah pt-24 menjadi pt-8 */}
      <main className="min-h-screen bg-gray-50 pt-8 pb-10">

        {/* --- NAVBAR BARU SESUAI GAMBAR --- */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
          <nav className="bg-white rounded-full shadow-md flex items-center justify-between py-3 px-6">
            {/* Brand Name */}
            <span className="text-2xl font-bold text-teal-900">
              Sikoltridi
            </span>
            
            {/* Home Button */}
            <a
              href="/"
              className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition"
            >
              Kembali Ke Home
            </a>
          </nav>
        </div>
        {/* --- AKHIR NAVBAR BARU --- */}


        <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-4">
                Penggunaan Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan
            </h1>
            
            {/* --- GARIS PEMISAH 1 --- */}
            <hr className="border-t border-gray-500 my-4" /> {/* Menggunakan border-t (1px) dan warna abu-abu */}
        </div>
        
        <Stepper step={step} />

        <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* --- GARIS PEMISAH 2 --- */}
            <hr className="border-t border-gray-500 my-4" /> {/* Menggunakan border-t (1px) dan warna abu-abu */}
        </div>

        {step === 1 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 print:hidden">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Identitas Responden
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Nama Lengkap:
                  </label>
                  <input
                    type="text"
                    value={respondent.nama}
                    onChange={(e) =>
                      setRespondent({ ...respondent, nama: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Jabatan:
                  </label>
                  <input
                    type="text"
                    value={respondent.jabatan}
                    onChange={(e) =>
                      setRespondent({ ...respondent, jabatan: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Lembaga:
                  </label>
                  <input
                    type="text"
                    value={respondent.lembaga}
                    onChange={(e) =>
                      setRespondent({ ...respondent, lembaga: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={nextFromIdentity}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
              >
                Lanjut
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <QuestionTable
            prefix="a"
            title="A. Aspek Manajemen Kolaborasi Tripusat Pendidikan"
            questions={QUESTIONS_A}
            values={answers}
            onChange={setAnswer}
            onBack={() => setStep(1)}
            onNext={() => {
              setStep(3);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            nextText="Lanjut"
          />
        )}

        {step === 3 && (
          <QuestionTable
            prefix="b"
            title="B. Aspek Penggunaan Sistem Informasi Kolaborasi Tripusat Pendidikan (Sikoltridi) Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan."
            questions={QUESTIONS_B}
            values={answers}
            onChange={setAnswer}
            onBack={() => setStep(2)}
            onNext={() => {
              setStep(4);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            nextText="Lanjut"
          />
        )}

        {step === 4 && (
          <QuestionTable
            prefix="c"
            title="C. Aspek Kemanfaatan Sistem Informasi Kolaborasi Tripusat Pendidikan (Sikoltridi) Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan."
            questions={QUESTIONS_C}
            values={answers}
            onChange={setAnswer}
            onBack={() => setStep(3)}
            onNext={() => {
              setStep(5);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            nextText="Lanjut"
          />
        )}

        {step === 5 && (
          <QuestionTable
            prefix="d"
            title="D. Aspek Kelengkapan Sistem Informasi Kolaborasi Tripusat Pendidikan (Sikoltridi) Model Pendidikan Kewirausahaan Anak Usia Dini Berbasis Kolaborasi Tripusat Pendidikan."
            questions={QUESTIONS_D}
            values={answers}
            onChange={setAnswer}
            onBack={() => setStep(4)}
            onNext={submitAll}
            nextText={sending ? "Mengirim…" : "Kirim"}
            nextDisabled={sending}
          />
        )}

        {step === 6 && (
          <SuccessView
            respondent={respondent}
            answers={answers}
            onAgain={resetAll}
          />
        )}
      </main>
      {/* Footer copyright */}
      <footer className="bg-white text-black text-center py-4 mt-10 border-t border-gray-200">
        <p className="text-sm tracking-wide">
          © Copyright <span className="font-bold">GAZEBOTECH 2025</span> All Rights Reserved
        </p>
      </footer>
    </>
  );
}