import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      jwtDecode(token); // validasi token
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 font-sans">
      <div className="bg-[#0a0a1a] border border-purple-500/40 backdrop-blur-xl 
                      p-10 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]
                      w-full max-w-xl text-center">

        <h1 className="text-4xl font-bold text-purple-400 mb-6 tracking-widest drop-shadow-lg">
          SYSTEM DASHBOARD
        </h1>

        <p className="text-purple-300 mb-10 text-sm font-medium opacity-80 
                      border-t border-b border-purple-500/30 py-3">
          ACCESS GRANTED — WELCOME BACK
        </p>

        <div className="grid grid-cols-2 gap-5 mb-10">

          <div
            onClick={() => navigate("/presensi")}
            className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 
                          p-5 rounded-xl border border-purple-500/40 
                          shadow-[0_0_12px_rgba(168,85,247,0.4)]
                          cursor-pointer transition duration-200 
                          hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]
                          hover:scale-105 font-semibold tracking-wider">
            PRESENSI
          </div>

          <div
            onClick={() => navigate("/reports")}
            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 
                          p-5 rounded-xl border border-blue-500/40 
                          shadow-[0_0_12px_rgba(59,130,246,0.4)]
                          cursor-pointer transition duration-200 
                          hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]
                          hover:scale-105 font-semibold tracking-wider">
            REPORTS
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600/30 hover:bg-red-600/50 
                     text-red-300 font-bold tracking-wider rounded-xl 
                     border border-red-500/40
                     shadow-[0_0_15px_rgba(239,68,68,0.4)]
                     hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]
                     transition duration-200 hover:scale-105">
          LOGOUT SYSTEM
        </button>

      </div>
    </div>
  );
}

export default DashboardPage;
