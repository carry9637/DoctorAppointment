import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendar, FaUserMd, FaChartBar } from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../helper/apiCall";
import axios from "axios";
import "../styles/admin-dashboard.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchDataCounts = async () => {
    try {
      dispatch(setLoading(true));
      const userData = await fetchData("/user/getallusers");
      const appointmentData = await fetchData(
        "/appointment/getallappointments"
      );
      const doctorData = await fetchData("/doctor/getalldoctors");
      setUserCount(userData.length);
      setAppointmentCount(appointmentData.length);
      setDoctorCount(doctorData.length);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching data counts:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchDataCounts();
  }, []);

  const chartData = [
    { name: "Users", count: userCount, fill: "#0066ff" },
    { name: "Doctors", count: doctorCount, fill: "#28a745" },
    { name: "Appointments", count: appointmentCount, fill: "#ffc107" },
  ];

  const barData = [
    { category: "Total Users", value: userCount },
    { category: "Total Doctors", value: doctorCount },
    { category: "Total Appointments", value: appointmentCount },
  ];

  if (loading) return <Loading />;

  return (
    <div className="admin-main">
      <div className="admin-header">
        <div className="header-title">Dashboard</div>
        <div className="header-right">
          <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
            Welcome, Admin
          </span>
        </div>
      </div>

      <div className="admin-content">
        {/* Stat Cards */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-card-icon" style={{ color: "#0066ff" }}>
              <FaUsers />
            </div>
            <div className="stat-card-label">Total Users</div>
            <div className="stat-card-value">{userCount}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon" style={{ color: "#28a745" }}>
              <FaUserMd />
            </div>
            <div className="stat-card-label">Total Doctors</div>
            <div className="stat-card-value">{doctorCount}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon" style={{ color: "#ffc107" }}>
              <FaCalendar />
            </div>
            <div className="stat-card-label">Total Appointments</div>
            <div className="stat-card-value">{appointmentCount}</div>
          </div>
        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* Bar Chart */}
          <div className="data-section">
            <div className="section-header">
              <div className="section-title">Statistics</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0066ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="data-section">
            <div className="section-header">
              <div className="section-title">Distribution</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
