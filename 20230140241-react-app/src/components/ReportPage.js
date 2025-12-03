import React, { useState } from "react";
import axios from "axios";

function ReportPage() {
  const [nama, setNama] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  // ===========================
  // HANDLE SUBMIT PENCARIAN
  // ===========================
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:3000/report/daily",
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

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Laporan Presensi</h2>

      {/* FORM FILTER */}
      <form onSubmit={handleSearchSubmit} className="mb-6 space-y-3">
        <div>
          <label>Nama:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>

        <div>
          <label>Tanggal Mulai:</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
          />
        </div>

        <div>
          <label>Tanggal Selesai:</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cari
        </button>
      </form>

      {/* TABEL LAPORAN */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Check-In</th>
            <th className="border p-2">Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                <td className="border p-2">{row.nama}</td>
                <td className="border p-2">{row.checkIn}</td>
                <td className="border p-2">{row.checkOut || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage;
