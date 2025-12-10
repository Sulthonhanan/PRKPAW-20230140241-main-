import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon Leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null); // FOTO SELFIE
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const webcamRef = useRef(null);
  const token = localStorage.getItem("token");

  // Ambil lokasi GPS
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

  useEffect(() => {
    getLocation();
  }, []);

  // Capture Foto
  const capture = () => {
    const photo = webcamRef.current.getScreenshot();
    setImage(photo);
  };

  // ========= HANDLE CHECK-IN (SELFIE + GPS) =========
  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum tersedia. Aktifkan GPS.");
      return;
    }
    if (!image) {
      setError("Anda harus mengambil foto selfie dulu!");
      return;
    }

    try {
      // Convert base64 -> Blob
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setError("");
      setImage(null);   // reset foto setelah sukses
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-in");
    }
  };

  // ========= HANDLE CHECK-OUT =========
  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-out");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Halaman Presensi (GPS + Selfie)</h2>

      {/* PETA */}
      {coords && (
        <div className="my-4 border rounded-lg overflow-hidden">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda Saat Ini</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* KAMERA */}
      <div className="my-4 border rounded-lg overflow-hidden bg-black">
        {image ? (
          <img src={image} alt="Selfie" className="w-full" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
          />
        )}
      </div>

      {/* TOMBOL AMBIL FOTO */}
      <div className="mb-4">
        {!image ? (
          <button
            onClick={capture}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Ambil Foto Selfie
          </button>
        ) : (
          <button
            onClick={() => setImage(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full"
          >
            Ulangi Foto
          </button>
        )}
      </div>

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

      {/* BUTTON */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleCheckIn}
          className="bg-blue-600 text-white p-3 rounded-lg"
        >
          Check In (Selfie + GPS)
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
