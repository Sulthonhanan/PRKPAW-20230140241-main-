import React, { useState, useEffect } from "react";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fungsi mendeteksi lokasi
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
      }
    );
  };

  // Ketika component pertama kali load → ambil lokasi
  useEffect(() => {
    getLocation();
  }, []);

  // Konfigurasi Axios
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  // ==============================
// HANDLE CHECK-IN  
// ==============================
const handleCheckIn = async () => {
  if (!coords) {
    setError("Lokasi belum tersedia. Aktifkan GPS.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:3001/api/presensi/check-in",  // FIXED URL
      {
        latitude: coords.lat,
        longitude: coords.lng,
      },
      config
    );

    setMessage(res.data.message);
  } catch (err) {
    setError(err.response?.data?.message || "Gagal check-in");
  }
};

  // ==============================
// HANDLE CHECK-OUT
// ==============================
const handleCheckOut = async () => {
  try {
    const res = await axios.post(
      "http://localhost:3001/api/presensi/check-out",  // FIXED URL
      {},
      config
    );

    setMessage(res.data.message);
  } catch (err) {
    setError(err.response?.data?.message || "Gagal check-out");
  }
};

  return (
    <div className="p-4">

      {/* PETA */}
      {coords && (
        <div className="my-4 border rounded-lg overflow-hidden">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Presensi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* STATUS */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
          {message}
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={handleCheckIn}
          className="bg-blue-600 text-white p-3 rounded-lg"
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          className="bg-green-600 text-white p-3 rounded-lg"
        >
          Check Out
        </button>
      </div>
    </div>
  );
}

export default PresensiPage;
