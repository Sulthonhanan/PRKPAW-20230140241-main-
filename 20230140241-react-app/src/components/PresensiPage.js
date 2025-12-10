import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet Icon
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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

  // Capture Foto Webcam
  const capture = () => {
    const photo = webcamRef.current.getScreenshot();
    setImage(photo);
  };

  // FULLSCREEN PREVIEW FOTO
  const FullscreenPreview = () => {
    if (!showPreview || !image) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        onClick={() => setShowPreview(false)}
      >
        <div
          className="relative max-w-3xl w-full p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image}
            alt="Preview Full"
            className="w-full h-auto object-contain rounded-lg shadow-xl"
          />

          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // HANDLE CHECK-IN (DIPERBAIKI AGAR MULTER BISA MEMBACA FILE)
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
      // KONVERSI BASE64 → FILE
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", file); // FIX UTAMA

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
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-in");
    }
  };

  // HANDLE CHECK-OUT
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

      <FullscreenPreview />

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

      {/* KAMERA / FOTO */}
      <div className="my-4 w-full flex justify-center">
        <div className="w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          {image ? (
            <img
              src={image}
              alt="Selfie"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowPreview(true)}
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                facingMode: "user",
                width: 1280,
                height: 720,
              }}
            />
          )}
        </div>
      </div>

      {/* TOMBOL FOTO */}
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
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">{error}</div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
          {message}
        </div>
      )}

      {/* BUTTON ACTION */}
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
