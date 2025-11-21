import React, { useState, useEffect } from "react";
import axios from "axios";

const Partfile = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/files");
                setFiles(response.data.data);
            } catch (err) {
                setError("Gagal memuat data file. Pastikan server backend berjalan.");
                console.error("Error fetching files:", err);
            }
        };

        fetchFiles();
    }, []);

    const handleOpenPDF = (pdfFile) => {
        window.open(`http://localhost:5000/uploads/files/${pdfFile}`, "_blank");
    };

    return (
        <div className="p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">File</h2>
                    <div className="w-16 h-[2px] bg-blue-500 mx-auto my-2"></div>
                    <p className="text-gray-600">
                        File Sikoltridi (MoU, Panduan Model, Buku SIKADI)
                    </p>
                </div>


                {error && (
                    <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
                )}

                <div className="flex flex-wrap gap-6 justify-center">
                    {files.length > 0 ? (
                        files.map((file) => (
                            <div
                                key={file.id}
                                className="relative overflow-hidden rounded-md shadow-md group cursor-pointer w-[300px]"
                                onClick={() => handleOpenPDF(file.pdf_file)}
                            >
                                <img
                                    src={
                                        file.image_file
                                            ? `http://localhost:5000/uploads/images/${file.image_file}`
                                            : "https://via.placeholder.com/100x150?text=No+Preview"
                                    }
                                    alt={file.title}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Judul muncul dari bawah saat hover */}
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
                                Tidak ada file yang tersedia.
                            </p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Partfile;
