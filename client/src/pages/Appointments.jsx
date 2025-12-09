import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoctorSidebar from "../components/DoctorSidebar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {
  FaCheckCircle,
  FaCalendar,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import "../styles/doctor-dashboard.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const { userId, role } = decodedToken;
  const isDoctor = role === "Doctor";

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      let temp;

      if (isDoctor) {
        // Doctor sees appointments from patients
        temp = await fetchData(
          `/appointment/getallappointments?doctorId=${userId}`
        );
        setAppointments(
          Array.isArray(temp)
            ? temp.filter((app) => app.status !== "Completed")
            : []
        );
      } else {
        // Patient sees their own services/appointments
        temp = await fetchData(`/appointment/getallappointments`);
        setAppointments(
          Array.isArray(temp)
            ? temp.filter((app) => app.userId?._id === userId)
            : []
        );
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch data. Please try again.");
      setAppointments([]);
    }
  };

  useEffect(() => {
    getAllAppoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAppointments = appointments.filter(
    (app) =>
      app.userId?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorId?.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completeAppointment = async (appointment) => {
    try {
      await axios.put(
        "/appointment/completed",
        {
          appointid: appointment._id,
          doctorId: appointment.doctorId._id,
          doctorname: `${appointment.doctorId.firstname} ${appointment.doctorId.lastname}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Appointment marked as completed.");
      getAllAppoint();
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment. Please try again.");
    }
  };

  return (
    <>
      <div className="doctor-layout">
        <DoctorSidebar />

        {loading ? (
          <div className="doctor-main">
            <div className="doctor-header">
              <div className="header-title">Loading...</div>
            </div>
            <div className="doctor-content">
              <Loading />
            </div>
          </div>
        ) : (
          <div className="doctor-main">
            <div className="doctor-header">
              <div className="header-title">
                {isDoctor ? "📅 Patient Appointments" : "🏥 My Services"}
              </div>
            </div>

            <div className="doctor-content">
              <div className="data-section">
                <div className="section-header">
                  <div>
                    <div className="section-title">
                      {isDoctor
                        ? "Pending Appointments"
                        : "Your Booked Services"}
                    </div>
                    <div
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.9rem",
                        marginTop: "5px",
                      }}
                    >
                      Total:{" "}
                      {Array.isArray(appointments) ? appointments.length : 0}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder={
                      isDoctor
                        ? "Search by patient name or email"
                        : "Search by doctor name"
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: "10px 15px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      width: "250px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                {Array.isArray(appointments) && appointments.length > 0 ? (
                  <>
                    {/* Desktop Table View */}
                    <div className="data-table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            {isDoctor ? (
                              <>
                                <th>Patient</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                              </>
                            ) : (
                              <>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Consultation Fee</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                              {isDoctor ? (
                                <>
                                  <td>
                                    <strong>
                                      {appointment.userId?.firstname}{" "}
                                      {appointment.userId?.lastname}
                                    </strong>
                                  </td>
                                  <td>{appointment.userId?.email}</td>
                                  <td>{appointment.number}</td>
                                  <td>{appointment.age}</td>
                                  <td>{appointment.gender}</td>
                                  <td>{appointment.bloodGroup}</td>
                                  <td>{appointment.date}</td>
                                  <td>
                                    <span className="status-badge status-pending">
                                      Pending
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-success"
                                      onClick={() =>
                                        completeAppointment(appointment)
                                      }
                                    >
                                      Complete
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>
                                    <strong>
                                      Dr. {appointment.doctorId?.firstname}{" "}
                                      {appointment.doctorId?.lastname}
                                    </strong>
                                  </td>
                                  <td>
                                    {appointment.doctorId?.specialization ||
                                      "N/A"}
                                  </td>
                                  <td>{appointment.number}</td>
                                  <td>{appointment.date}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${
                                        appointment.status === "Completed"
                                          ? "status-completed"
                                          : "status-pending"
                                      }`}
                                    >
                                      {appointment.status}
                                    </span>
                                  </td>
                                  <td>
                                    ₹{appointment.doctorId?.fees || "N/A"}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div style={{ display: "none" }} className="mobile-view">
                      {filteredAppointments.map((appointment) => (
                        <div className="mobile-card" key={appointment._id}>
                          <div className="card-field">
                            <span className="card-field-label">
                              <FaUser /> Patient Name
                            </span>
                            <span className="card-field-value">
                              {appointment.userId?.firstname}{" "}
                              {appointment.userId?.lastname}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">Email</span>
                            <span className="card-field-value">
                              {appointment.userId?.email}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">
                              <FaPhone /> Phone
                            </span>
                            <span className="card-field-value">
                              {appointment.number}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">Age</span>
                            <span className="card-field-value">
                              {appointment.age}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">Gender</span>
                            <span className="card-field-value">
                              {appointment.gender}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">
                              Blood Group
                            </span>
                            <span className="card-field-value">
                              {appointment.bloodGroup}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">
                              <FaCalendar /> Date
                            </span>
                            <span className="card-field-value">
                              {appointment.date}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">Status</span>
                            <span className="card-field-value">
                              <span className="status-badge status-pending">
                                Pending
                              </span>
                            </span>
                          </div>
                          <div style={{ marginTop: "15px" }}>
                            <button
                              className="btn btn-success"
                              onClick={() => completeAppointment(appointment)}
                              style={{ width: "100%" }}
                            >
                              <FaCheckCircle /> Mark as Completed
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-text">
                      No pending appointments found
                    </div>
                    <div
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.9rem",
                        marginTop: "10px",
                      }}
                    >
                      You can check back later for new appointments
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Appointments;
