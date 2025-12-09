import React from "react";
import AdminApplications from "../components/AdminApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import AdminSidebar from "../components/AdminSidebar";
import AdminUsers from "../components/AdminUsers";
import AdminHome from "../components/AdminHome";
import Aprofile from "../components/Aprofile";
import "../styles/admin-dashboard.css";

const Dashboard = (props) => {
  const { type } = props;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      {type === "home" ? (
        <AdminHome />
      ) : type === "users" ? (
        <AdminUsers />
      ) : type === "doctors" ? (
        <AdminDoctors />
      ) : type === "applications" ? (
        <AdminApplications />
      ) : type === "aprofile" ? (
        <Aprofile />
      ) : (
        <div className="admin-main">
          <div className="admin-header">
            <div className="header-title">Dashboard</div>
          </div>
          <div className="admin-content">
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">Select a page from sidebar</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
