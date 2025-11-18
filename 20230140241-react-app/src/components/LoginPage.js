import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">

      {/* Neon Blur Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-black to-blue-800/30"></div>

      {/* Neon Circles */}
      <div className="absolute w-80 h-80 bg-purple-600/30 blur-3xl rounded-full -top-10 -left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-600/30 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-black/60 backdrop-blur-xl border 
                      border-purple-500/40 rounded-2xl p-8 shadow-[0_0_20px_rgba(138,43,226,0.4)]
                      hover:shadow-[0_0_35px_rgba(138,43,226,0.7)] transition">

        <h2 className="text-3xl font-bold text-center text-purple-300 mb-8 drop-shadow-[0_0_10px_#a855f7]">
          LOGIN PORTAL
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-purple-200 text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 bg-black/40 text-purple-100 border border-purple-500/40 
                         rounded-xl focus:ring-2 focus:ring-purple-500 outline-none
                         shadow-[0_0_10px_rgba(138,43,226,0.3)]"
              placeholder="Your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-purple-200 text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 bg-black/40 text-purple-100 border border-purple-500/40 
                         rounded-xl focus:ring-2 focus:ring-blue-500 outline-none
                         shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              placeholder="Your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 
                       text-white font-bold shadow-[0_0_15px_rgba(138,43,226,0.6)]
                       hover:shadow-[0_0_25px_rgba(59,130,246,0.9)] transition active:scale-95"
          >
            LOGIN
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-4 text-center bg-red-950/40 p-2 rounded-md border border-red-500/40">
            {error}
          </p>
        )}

        {/* Register */}
        <p className="text-center mt-6 text-sm text-purple-200">
          Belum punya akun?
          <a href="/register" className="text-blue-400 font-semibold hover:underline ml-1">
            Daftar di sini
          </a>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;
