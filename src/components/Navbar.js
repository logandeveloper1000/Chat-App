import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import AlertDropdown from "./AlertDropdown";
import { Bell } from "lucide-react";

export default function Navbar({ alerts, clearAlerts }) {
  const [showAlerts, setShowAlerts] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAlerts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Navigate to chat when alert clicked
  const handleAlertClick = (chatId) => {
    setShowAlerts(false);
    navigate(`/chat/${chatId}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        ChatApp
      </div>
      <div className="nav-right">
        <button className="outlined-yellow" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="filled-yellow" onClick={handleLogout}>
          Logout
        </button>
        <div className="alertWrapper" ref={dropdownRef}>
          <div onClick={() => setShowAlerts(!showAlerts)} className="bellContainer">
            <Bell color="#fff" />
            {alerts.length > 0 && <span className="redDot" />}
          </div>
          {showAlerts && (
            <AlertDropdown
              alerts={alerts}
              clearAlerts={clearAlerts}
              onAlertClick={handleAlertClick}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
