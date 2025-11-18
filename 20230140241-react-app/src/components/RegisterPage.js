import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        role,
        email,
        password,
      });

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Registrasi gagal. Coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">

      <div className="bg-[#0a0a1a] border border-purple-500/40 p-10 rounded-xl shadow-[0_0_15px_rgba(138,43,226,0.5)] w-full max-w-md">

        <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-400 tracking-widest drop-shadow-[0_0_6px_#a855f7]">
          REGISTER
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAMA */}
          <div>
            <label className="block text-sm font-bold text-purple-300 uppercase mb-1 tracking-wide">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#11112a] border border-purple-500/40 text-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-bold text-purple-300 uppercase mb-1 tracking-wide">
              Role Akun
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#11112a] border border-purple-500/40 text-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            >
              <option value="mahasiswa" className="text-black">Mahasiswa</option>
              <option value="admin" className="text-black">Admin</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold text-purple-300 uppercase mb-1 tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#11112a] border border-purple-500/40 text-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-purple-300 uppercase mb-1 tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#11112a] border border-purple-500/40 text-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-[0_0_12px_rgba(168,85,247,0.8)] transition"
          >
            CREATE ACCOUNT
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mt-6 text-center bg-red-900/30 p-2 border border-red-700 rounded-lg shadow-[0_0_10px_rgba(255,0,0,0.6)]">
            ERROR: {error}
          </p>
        )}

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-sm text-purple-300">
          Sudah punya akun?{" "}
          <a href="/login" className="text-purple-400 font-bold hover:underline">
            LOGIN
          </a>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;
