import React, { useState } from "react";
import axios from "axios";

// URL BACKEND STATIS. PASTIKAN PORT 3001 SUDAH BENAR
const BASE_URL = "http://localhost:3001/"; 

function ReportPage() {
  const [nama, setNama] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [data, setData] = useState([]);
  const [previewFoto, setPreviewFoto] = useState(null); // URL foto yang akan ditampilkan di modal

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${BASE_URL}api/reports`, // Menggunakan BASE_URL di sini
        {
          params: {
            nama: nama || undefined,
            tanggalMulai: tanggalMulai || undefined,
            tanggalSelesai: tanggalSelesai || undefined,
          },
          ...config,
        }
      );

      setData(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil laporan");
    }
  };

  const FullscreenModal = () => {
    if (!previewFoto) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300"
        onClick={() => setPreviewFoto(null)}
      >
        {/* Konten Modal */}
        <div
          className="relative max-w-4xl max-h-screen w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={previewFoto}
            alt="Bukti Foto Presensi"
            // Menggunakan max-width dan max-height untuk memastikan foto pas di layar
            className="block w-auto max-w-full max-h-[90vh] mx-auto object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={() => setPreviewFoto(null)}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full shadow-lg transition duration-200"
          >
            &times; {/* Menggunakan tanda kali (X) yang lebih umum */}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <FullscreenModal />

      <h2 className="text-2xl font-bold mb-4">Laporan Presensi</h2>

      <form onSubmit={handleSearchSubmit} className="mb-6 space-y-3 md:flex md:space-x-4 md:space-y-0 items-end">
        {/* Form elements... (tidak diubah) */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Nama:</label>
          <input
            type="text"
            className="border p-2 w-full rounded-md mt-1"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Tanggal Mulai:</label>
          <input
            type="date"
            className="border p-2 w-full rounded-md mt-1"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Tanggal Selesai:</label>
          <input
            type="date"
            className="border p-2 w-full rounded-md mt-1"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200">
          Cari
        </button>
      </form>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Check-Out</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti Foto</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row) => {
                // VVVV --- PERBAIKAN: GUNAKAN REGEX UNTUK MENGGANTI SEMUA BACKSLASH --- VVVV
                const fotoPath = row.buktiFoto ? row.buktiFoto.replace(/\\/g, "/") : null;
                const fotoUrl = fotoPath ? `${BASE_URL}${fotoPath}` : null;
                // ^^^^ ------------------------------------------------------------- ^^^^
                
                return (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">{row.user?.nama || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{formatDate(row.checkIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{formatDate(row.checkOut)}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {fotoUrl ? (
                        // Thumbnail untuk diklik
                        <div 
                          className="flex justify-center"
                          onClick={() => setPreviewFoto(fotoUrl)}
                        >
                            <img
                              src={fotoUrl}
                              alt="Bukti Presensi"
                              className="w-16 h-16 object-cover rounded-md shadow-md cursor-pointer transition transform hover:scale-105"
                            />
                            {/*  */}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;