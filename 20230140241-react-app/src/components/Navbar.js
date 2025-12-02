import React from "react";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;    
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">Presensi App</h1>

      <div className="flex space-x-4 items-center">
        <span>{user?.nama}</span>

        <Link to="/presensi">Presensi</Link>

        {user?.role === "admin" && (
          <Link to="/reports">Laporan Admin</Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
