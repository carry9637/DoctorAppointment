import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../helper/apiCall";
import "../styles/admin-dashboard.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllApp = async (e) => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctor/getallapplications`);
      setApplications(Array.isArray(temp) ? temp : []);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      setApplications([]);
      toast.error("Failed to load applications");
    }
  };

  const acceptUser = async (userId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to accept this application?"
      );
      if (confirm) {
        await toast.promise(
          axios.patch(
            "/doctor/approveddoctor",
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Application approved successfully",
            error: "Unable to approve application",
            loading: "Approving application...",
          }
        );
        getAllApp();
      }
    } catch (error) {
      toast.error("Error approving application");
      return error;
    }
  };

  const rejectUser = async (userId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to reject this application?"
      );
      if (confirm) {
        await toast.promise(
          axios.patch(
            "/doctor/rejectedapplication",
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Application rejected successfully",
            error: "Unable to reject application",
            loading: "Rejecting application...",
          }
        );
        getAllApp();
      }
    } catch (error) {
      toast.error("Error rejecting application");
      return error;
    }
  };

  useEffect(() => {
    getAllApp();
  }, []);

  return (
    <div className="admin-main">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="admin-header">
            <div className="header-title">Doctor Applications</div>
          </div>

          <div className="admin-content">
            <div className="data-section">
              <div className="section-header">
                <div className="section-title">Pending Applications</div>
                <div style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
                  Total: {Array.isArray(applications) ? applications.length : 0}
                </div>
              </div>

              {Array.isArray(applications) && applications.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Profile</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Experience</th>
                          <th>Specialization</th>
                          <th>Fees</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(applications) &&
                          applications?.map((ele) => (
                            <tr key={ele?._id}>
                              <td>
                                <img
                                  src={
                                    ele?.userId?.pic ||
                                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                                  }
                                  alt={ele?.userId?.firstname}
                                  className="table-avatar"
                                />
                              </td>
                              <td>
                                {ele?.userId?.firstname} {ele?.userId?.lastname}
                              </td>
                              <td>{ele?.userId?.email}</td>
                              <td>{ele?.userId?.mobile}</td>
                              <td>{ele?.experience} years</td>
                              <td>{ele?.specialization}</td>
                              <td>₹{ele?.fees}</td>
                              <td>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button
                                    className="btn btn-success"
                                    onClick={() => acceptUser(ele?.userId?._id)}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => rejectUser(ele?.userId?._id)}
                                  >
                                    ✕ Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div>
                    {Array.isArray(applications) &&
                      applications?.map((ele) => (
                        <div className="mobile-card" key={ele?._id}>
                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <img
                              src={
                                ele?.userId?.pic ||
                                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                              }
                              alt={ele?.userId?.firstname}
                              className="table-avatar"
                            />
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: "600",
                                  color: "var(--text-dark)",
                                }}
                              >
                                {ele?.userId?.firstname} {ele?.userId?.lastname}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "var(--text-light)",
                                }}
                              >
                                {ele?.userId?.email}
                              </div>
                            </div>
                          </div>

                          <div className="card-row">
                            <span className="card-label">Mobile</span>
                            <span className="card-value">
                              {ele?.userId?.mobile || "N/A"}
                            </span>
                          </div>

                          <div className="card-row">
                            <span className="card-label">Experience</span>
                            <span className="card-value">
                              {ele?.experience} years
                            </span>
                          </div>

                          <div className="card-row">
                            <span className="card-label">Specialization</span>
                            <span className="card-value">
                              {ele?.specialization}
                            </span>
                          </div>

                          <div className="card-row">
                            <span className="card-label">Fees</span>
                            <span className="card-value">₹{ele?.fees}</span>
                          </div>

                          <div className="card-actions">
                            <button
                              className="btn btn-success"
                              onClick={() => acceptUser(ele?.userId?._id)}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => rejectUser(ele?.userId?._id)}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">No applications found</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminApplications;
