import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendar,
  FaBell,
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaStethoscope,
} from "react-icons/fa";
import "../styles/doctor-dashboard.css";

const DoctorSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="doctor-toggle-btn" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`doctor-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-brand">
          <FaStethoscope /> MediCare Doctor
        </div>

        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link
              to="/"
              className={`sidebar-menu-link ${isActive("/")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaHome />
              </span>
              <span>Home</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/appointments"
              className={`sidebar-menu-link ${isActive("/appointments")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaCalendar />
              </span>
              <span>Appointments</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/notifications"
              className={`sidebar-menu-link ${isActive("/notifications")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaBell />
              </span>
              <span>Notifications</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/profile"
              className={`sidebar-menu-link ${isActive("/profile")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaUser />
              </span>
              <span>Profile</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/changepassword"
              className={`sidebar-menu-link ${isActive("/changepassword")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaLock />
              </span>
              <span>Change Password</span>
            </Link>
          </li>
        </ul>

        <div className="sidebar-logout">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DoctorSidebar;
