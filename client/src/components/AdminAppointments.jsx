import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/admin-dashboard.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllAppointments = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/appointment/getallappointments`);
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const completeAppointment = async (appointment) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: appointment?._id,
            doctorId: appointment?.doctorId._id,
            doctorname: `${appointment?.userId?.firstname} ${appointment?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Marking appointment complete...",
          success: "Appointment marked as completed",
          error: "Unable to update appointment",
        }
      );
      getAllAppointments();
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="admin-main">
      <div className="admin-header">
        <div className="header-title">Appointments Management</div>
      </div>

      <div className="admin-content">
        <div className="data-section">
          <div className="section-header">
            <div className="section-title">All Appointments</div>
            <div style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
              Total: {appointments.length}
            </div>
          </div>

          {/* Desktop Table View */}
          {appointments.length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Specialization</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments?.map((appointment) => (
                    <tr key={appointment?._id}>
                      <td>
                        <div style={{ fontWeight: "500" }}>
                          {appointment?.doctorId?.firstname}{" "}
                          {appointment?.doctorId?.lastname}
                        </div>
                      </td>
                      <td>
                        {appointment?.userId?.firstname}{" "}
                        {appointment?.userId?.lastname}
                      </td>
                      <td>{appointment?.userId?.email}</td>
                      <td>{appointment?.number}</td>
                      <td>{appointment?.date}</td>
                      <td>{appointment?.time}</td>
                      <td>{appointment?.doctorId?.specialization || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            appointment?.status === "Completed"
                              ? "status-completed"
                              : "status-pending"
                          }`}
                        >
                          {appointment?.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-success ${
                            appointment?.status === "Completed"
                              ? "disabled"
                              : ""
                          }`}
                          disabled={appointment?.status === "Completed"}
                          onClick={() => completeAppointment(appointment)}
                        >
                          <FaCheckCircle /> Complete
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
            {appointments.map((appointment) => (
              <div className="mobile-card" key={appointment?._id}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--text-dark)",
                      marginBottom: "4px",
                    }}
                  >
                    Dr. {appointment?.doctorId?.firstname}{" "}
                    {appointment?.doctorId?.lastname}
                  </div>
                  <div
                    style={{ fontSize: "0.85rem", color: "var(--text-light)" }}
                  >
                    Patient: {appointment?.userId?.firstname}{" "}
                    {appointment?.userId?.lastname}
                  </div>
                </div>

                <div className="card-row">
                  <span className="card-label">Email</span>
                  <span className="card-value" style={{ fontSize: "0.85rem" }}>
                    {appointment?.userId?.email}
                  </span>
                </div>

                <div className="card-row">
                  <span className="card-label">Mobile</span>
                  <span className="card-value">{appointment?.number}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Appointment Date</span>
                  <span className="card-value">{appointment?.date}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Appointment Time</span>
                  <span className="card-value">{appointment?.time}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Blood Group</span>
                  <span className="card-value">{appointment?.bloodGroup}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Status</span>
                  <span className="card-value">
                    <span
                      className={`status-badge ${
                        appointment?.status === "Completed"
                          ? "status-completed"
                          : "status-pending"
                      }`}
                    >
                      {appointment?.status}
                    </span>
                  </span>
                </div>

                <div className="card-actions">
                  <button
                    className={`btn btn-success ${
                      appointment?.status === "Completed" ? "disabled" : ""
                    }`}
                    disabled={appointment?.status === "Completed"}
                    onClick={() => completeAppointment(appointment)}
                  >
                    <FaCheckCircle /> Complete
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

export default AdminAppointments;
