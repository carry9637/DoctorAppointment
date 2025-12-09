import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import { FaTrash } from "react-icons/fa";
import "../styles/admin-dashboard.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllDoctors = async () => {
    try {
      dispatch(setLoading(true));
      let url = "/doctor/getalldoctors";
      if (searchTerm.trim() !== "") {
        url += `?search=${searchTerm}`;
      }
      const temp = await fetchData(url);
      setDoctors(temp);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const deleteDoctor = async (doctorUserId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this doctor?"
      );
      if (confirm) {
        await axios.put(
          "/doctor/deletedoctor",
          { userId: doctorUserId },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Doctor deleted successfully");
        getAllDoctors();
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error.response?.data || "Unable to delete doctor";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    getAllDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.userId?.firstname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.userId?.lastname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="admin-main">
      <div className="admin-header">
        <div className="header-title">Doctors Management</div>
      </div>

      <div className="admin-content">
        <div className="data-section">
          <div className="section-header">
            <div className="section-title">All Doctors</div>
            <div style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
              Total: {filteredDoctors.length}
            </div>
          </div>

          {/* Search */}
          <div className="filter-container">
            <div className="filter-group" style={{ maxWidth: "400px" }}>
              <label>Search Doctors</label>
              <input
                type="text"
                placeholder="Search by name, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Table View */}
          {filteredDoctors.length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fees</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>
                        <img
                          src={doctor.userId?.pic}
                          alt={doctor.userId?.firstname}
                          className="table-avatar"
                        />
                      </td>
                      <td>
                        {doctor.userId?.firstname} {doctor.userId?.lastname}
                      </td>
                      <td>{doctor.userId?.email}</td>
                      <td>{doctor.userId?.mobile}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.experience || "N/A"} years</td>
                      <td>Rs {doctor.fees}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteDoctor(doctor.userId?._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}

          {/* Mobile Card View */}
          <div>
            {filteredDoctors.map((doctor) => (
              <div className="mobile-card" key={doctor._id}>
                <div
                  style={{ display: "flex", gap: "12px", marginBottom: "12px" }}
                >
                  <img
                    src={doctor.userId?.pic}
                    alt={doctor.userId?.firstname}
                    className="table-avatar"
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: "600", color: "var(--text-dark)" }}
                    >
                      {doctor.userId?.firstname} {doctor.userId?.lastname}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-light)",
                      }}
                    >
                      {doctor.specialization}
                    </div>
                  </div>
                </div>

                <div className="card-row">
                  <span className="card-label">Email</span>
                  <span className="card-value" style={{ fontSize: "0.85rem" }}>
                    {doctor.userId?.email}
                  </span>
                </div>

                <div className="card-row">
                  <span className="card-label">Mobile</span>
                  <span className="card-value">{doctor.userId?.mobile}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Experience</span>
                  <span className="card-value">
                    {doctor.experience || "N/A"} years
                  </span>
                </div>

                <div className="card-row">
                  <span className="card-label">Fees</span>
                  <span className="card-value">Rs {doctor.fees}</span>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteDoctor(doctor.userId?._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
