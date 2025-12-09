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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useSelector((state) => state.root);

  const getAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      let url = "/user/getallusers";
      if (searchTerm.trim() !== "") {
        url += `?search=${searchTerm}`;
      }
      const temp = await fetchData(url);
      setUsers(temp);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirm) {
        await toast.promise(
          axios.delete("/user/deleteuser", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { userId },
          }),
          {
            pending: "Deleting user...",
            success: "User deleted successfully",
            error: "Unable to delete user",
          }
        );
        getAllUsers();
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="admin-main">
      <div className="admin-header">
        <div className="header-title">Users Management</div>
      </div>

      <div className="admin-content">
        <div className="data-section">
          <div className="section-header">
            <div className="section-title">All Users</div>
            <div style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
              Total: {filteredUsers.length}
            </div>
          </div>

          {/* Search */}
          <div className="filter-container">
            <div className="filter-group" style={{ maxWidth: "400px" }}>
              <label>Search Users</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "35px",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Cpath fill=%22%236c757d%22 d=%22M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.376.368.853.872 1.398 1.397l3.85 3.85a1 1 0 1 0 1.415-1.414l-3.85-3.85zm-5.742-6.344a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z%22/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "10px center",
                  backgroundSize: "16px",
                }}
              />
            </div>
          </div>

          {/* Desktop Table View */}
          {filteredUsers.length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Is Doctor</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <img
                          src={user.pic}
                          alt={user.firstname}
                          className="table-avatar"
                        />
                      </td>
                      <td>
                        {user.firstname} {user.lastname}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.age || "N/A"}</td>
                      <td>{user.gender || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.isDoctor ? "status-active" : "status-pending"
                          }`}
                        >
                          {user.isDoctor ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteUser(user._id)}
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
            {filteredUsers.map((user) => (
              <div className="mobile-card" key={user._id}>
                <div
                  style={{ display: "flex", gap: "12px", marginBottom: "12px" }}
                >
                  <img
                    src={user.pic}
                    alt={user.firstname}
                    className="table-avatar"
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: "600", color: "var(--text-dark)" }}
                    >
                      {user.firstname} {user.lastname}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-light)",
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="card-row">
                  <span className="card-label">Mobile</span>
                  <span className="card-value">{user.mobile}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Age</span>
                  <span className="card-value">{user.age || "N/A"}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Gender</span>
                  <span className="card-value">{user.gender || "N/A"}</span>
                </div>

                <div className="card-row">
                  <span className="card-label">Is Doctor</span>
                  <span className="card-value">
                    <span
                      className={`status-badge ${
                        user.isDoctor ? "status-active" : "status-pending"
                      }`}
                    >
                      {user.isDoctor ? "Yes" : "No"}
                    </span>
                  </span>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user._id)}
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

export default AdminUsers;
