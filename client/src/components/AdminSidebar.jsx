import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaUserMd,
  FaCalendar,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/admin-dashboard.css";

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      <button className="admin-toggle-btn" onClick={toggleSidebar}>
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
      <aside className={`admin-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-brand">
          <FaHome /> MediCare Admin
        </div>

        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link
              to="/dashboard/home"
              className={`sidebar-menu-link ${isActive("/dashboard/home")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaHome />
              </span>
              <span>Dashboard</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/dashboard/users"
              className={`sidebar-menu-link ${isActive("/dashboard/users")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaUsers />
              </span>
              <span>Users</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/dashboard/doctors"
              className={`sidebar-menu-link ${isActive("/dashboard/doctors")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaUserMd />
              </span>
              <span>Doctors</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/dashboard/applications"
              className={`sidebar-menu-link ${isActive(
                "/dashboard/applications"
              )}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaFileAlt />
              </span>
              <span>Applications</span>
            </Link>
          </li>

          <li className="sidebar-menu-item">
            <Link
              to="/dashboard/aprofile"
              className={`sidebar-menu-link ${isActive("/dashboard/aprofile")}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-menu-icon">
                <FaUser />
              </span>
              <span>Profile</span>
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

export default AdminSidebar;
