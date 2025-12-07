import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoctorSidebar from "../components/DoctorSidebar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { FaBell, FaClock, FaCheck } from "react-icons/fa";
import "../styles/doctor-dashboard.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/notification/getallnotifs`);
      setNotifications(Array.isArray(temp) ? temp : []);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    getAllNotif();
  }, []);

  const getNotificationIcon = (content) => {
    if (content.includes("accepted"))
      return <FaCheck style={{ color: "var(--success)" }} />;
    if (content.includes("rejected"))
      return <FaBell style={{ color: "var(--danger)" }} />;
    return <FaBell style={{ color: "var(--primary)" }} />;
  };

  const getNotificationColor = (content) => {
    if (content.includes("accepted")) return "status-approved";
    if (content.includes("rejected")) return "status-rejected";
    return "status-pending";
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
              <div className="header-title">🔔 Your Notifications</div>
            </div>

            <div className="doctor-content">
              <div className="data-section">
                <div className="section-header">
                  <div>
                    <div className="section-title">Notifications</div>
                    <div
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.9rem",
                        marginTop: "5px",
                      }}
                    >
                      Total:{" "}
                      {Array.isArray(notifications) ? notifications.length : 0}
                    </div>
                  </div>
                </div>

                {Array.isArray(notifications) && notifications.length > 0 ? (
                  <>
                    {/* Desktop Table View */}
                    <div className="data-table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((notif) => (
                            <tr key={notif?._id}>
                              <td>
                                <span
                                  className={`status-badge ${getNotificationColor(
                                    notif?.content
                                  )}`}
                                >
                                  {getNotificationIcon(notif?.content)}
                                </span>
                              </td>
                              <td>{notif?.content}</td>
                              <td>{notif?.updatedAt?.split("T")[0]}</td>
                              <td>
                                {notif?.updatedAt?.split("T")[1]?.split(".")[0]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div style={{ display: "none" }} className="mobile-view">
                      {notifications.map((notif) => (
                        <div className="mobile-card" key={notif?._id}>
                          <div className="card-field">
                            <span className="card-field-label">Status</span>
                            <span className="card-field-value">
                              <span
                                className={`status-badge ${getNotificationColor(
                                  notif?.content
                                )}`}
                              >
                                {getNotificationIcon(notif?.content)}
                              </span>
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">Message</span>
                            <span className="card-field-value">
                              {notif?.content}
                            </span>
                          </div>
                          <div className="card-field">
                            <span className="card-field-label">
                              <FaClock /> Date & Time
                            </span>
                            <span className="card-field-value">
                              {notif?.updatedAt?.split("T")[0]}{" "}
                              {notif?.updatedAt?.split("T")[1]?.split(".")[0]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📬</div>
                    <div className="empty-state-text">No notifications yet</div>
                    <div
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.9rem",
                        marginTop: "10px",
                      }}
                    >
                      You will receive notifications about your applications and
                      appointments here
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

export default Notifications;
