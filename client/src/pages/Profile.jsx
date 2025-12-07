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
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCake,
  FaMapMarkerAlt,
  FaVenusMars,
} from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      setFormDetails({
        ...temp,
        password: "",
        confpassword: "",
        mobile: temp.mobile === null ? "" : temp.mobile,
        age: temp.age === null ? "" : temp.age,
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const {
        firstname,
        lastname,
        email,
        age,
        mobile,
        address,
        gender,
        password,
        confpassword,
      } = formDetails;

      if (!email) {
        return toast.error("Email should not be empty");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      } else if (password && password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }
      await toast.promise(
        axios.put(
          "/user/updateprofile",
          {
            firstname,
            lastname,
            age,
            mobile,
            address,
            gender,
            email,
            ...(password && { password }),
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );

      setFormDetails({ ...formDetails, password: "", confpassword: "" });
    } catch (error) {
      return toast.error("Unable to update profile");
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
              <div className="header-title">👤 My Profile</div>
            </div>

            <div className="doctor-content">
              <div className="data-section" style={{ maxWidth: "700px" }}>
                <div
                  className="section-header"
                  style={{ marginBottom: "30px" }}
                >
                  <div className="section-title">Update Your Information</div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                  <img
                    src={file}
                    alt="profile"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid var(--primary)",
                    }}
                  />
                </div>

                <form onSubmit={formSubmit}>
                  {/* Name Fields */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="filter-group">
                      <label htmlFor="firstname">First Name</label>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        placeholder="Enter your first name"
                        value={formDetails.firstname}
                        onChange={inputChange}
                        required
                      />
                    </div>
                    <div className="filter-group">
                      <label htmlFor="lastname">Last Name</label>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        placeholder="Enter your last name"
                        value={formDetails.lastname}
                        onChange={inputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email and Gender */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="filter-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formDetails.email}
                        onChange={inputChange}
                        required
                      />
                    </div>
                    <div className="filter-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formDetails.gender}
                        onChange={inputChange}
                      >
                        <option value="neither">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Age and Mobile */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="filter-group">
                      <label htmlFor="age">Age</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        placeholder="Enter your age"
                        value={formDetails.age}
                        onChange={inputChange}
                      />
                    </div>
                    <div className="filter-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        placeholder="Enter your mobile number"
                        value={formDetails.mobile}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="filter-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={formDetails.address}
                      onChange={inputChange}
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Password Section */}
                  <div
                    style={{
                      marginTop: "30px",
                      paddingTop: "20px",
                      borderTop: "2px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-dark)",
                        marginBottom: "15px",
                      }}
                    >
                      🔐 Change Password (Optional)
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="filter-group">
                        <label htmlFor="password">New Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Leave empty to keep current password"
                          value={formDetails.password}
                          onChange={inputChange}
                        />
                      </div>
                      <div className="filter-group">
                        <label htmlFor="confpassword">Confirm Password</label>
                        <input
                          type="password"
                          id="confpassword"
                          name="confpassword"
                          placeholder="Confirm your new password"
                          value={formDetails.confpassword}
                          onChange={inputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-start",
                      marginTop: "30px",
                    }}
                  >
                    <button type="submit" className="btn btn-primary">
                      💾 Update Profile
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: "var(--border-color)",
                        color: "var(--text-dark)",
                      }}
                      onClick={() => getUser()}
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

export default Profile;
