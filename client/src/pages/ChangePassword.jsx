import React, { useEffect, useState } from "react";
import "../styles/doctor-dashboard.css";
import DoctorSidebar from "../components/DoctorSidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";
import { FaLock, FaShieldAlt } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ChangePassword() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    password: "",
    newpassword: "",
    confnewpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const { password, newpassword, confnewpassword } = formDetails;

    if (!password) {
      return toast.error("Current password is required");
    } else if (!newpassword) {
      return toast.error("New password is required");
    } else if (newpassword.length < 5) {
      return toast.error("New password must be at least 5 characters long");
    } else if (newpassword !== confnewpassword) {
      return toast.error("New passwords do not match");
    }

    try {
      await toast.promise(
        axios.put(
          "/user/changepassword",
          {
            userId: userId,
            currentPassword: password,
            newPassword: newpassword,
            confirmNewPassword: confnewpassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating password...",
          success: "Password updated successfully",
          error: "Unable to update password",
        }
      );

      setFormDetails({
        password: "",
        newpassword: "",
        confnewpassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response?.data) {
        toast.error(error.response.data);
      }
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
              <div className="header-title">🔐 Change Password</div>
            </div>

            <div className="doctor-content">
              <div className="data-section" style={{ maxWidth: "600px" }}>
                <div
                  className="section-header"
                  style={{ marginBottom: "30px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div style={{ fontSize: "2rem", color: "var(--primary)" }}>
                      <FaShieldAlt />
                    </div>
                    <div>
                      <div className="section-title">Secure Your Account</div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-light)",
                          marginTop: "5px",
                        }}
                      >
                        Update your password to keep your account secure
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={formSubmit}>
                  {/* Current Password */}
                  <div className="filter-group">
                    <label htmlFor="password">Current Password *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your current password"
                      value={formDetails.password}
                      onChange={inputChange}
                      required
                    />
                  </div>

                  {/* New Password Fields */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="filter-group">
                      <label htmlFor="newpassword">New Password *</label>
                      <input
                        type="password"
                        id="newpassword"
                        name="newpassword"
                        placeholder="Enter your new password"
                        value={formDetails.newpassword}
                        onChange={inputChange}
                        required
                      />
                    </div>
                    <div className="filter-group">
                      <label htmlFor="confnewpassword">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        id="confnewpassword"
                        name="confnewpassword"
                        placeholder="Confirm your new password"
                        value={formDetails.confnewpassword}
                        onChange={inputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div
                    style={{
                      marginBottom: "25px",
                      padding: "15px",
                      backgroundColor: "#f0f4f8",
                      borderLeft: "4px solid var(--info)",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      color: "var(--text-dark)",
                    }}
                  >
                    <strong>Password Requirements:</strong>
                    <ul
                      style={{
                        marginTop: "8px",
                        marginLeft: "20px",
                        lineHeight: "1.6",
                      }}
                    >
                      <li>At least 5 characters long</li>
                      <li>Contains a mix of characters</li>
                      <li>Different from your current password</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-start",
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      <FaLock /> Update Password
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: "var(--border-color)",
                        color: "var(--text-dark)",
                        flex: 1,
                      }}
                      onClick={() =>
                        setFormDetails({
                          password: "",
                          newpassword: "",
                          confnewpassword: "",
                        })
                      }
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChangePassword;
