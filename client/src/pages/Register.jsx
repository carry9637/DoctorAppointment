import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
    role: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const onUpload = async (element) => {
    if (!element) return;

    if (
      element.type === "image/jpeg" ||
      element.type === "image/png" ||
      element.type === "image/jpg"
    ) {
      // If Cloudinary is configured, use it; otherwise convert to base64 locally
      const cloudUrl = process.env.REACT_APP_CLOUDINARY_BASE_URL;
      const cloudPreset = process.env.REACT_APP_CLOUDINARY_PRESET;
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

      if (cloudUrl && cloudPreset && cloudName) {
        setLoading(true);
        const data = new FormData();
        data.append("file", element);
        data.append("upload_preset", cloudPreset);
        data.append("cloud_name", cloudName);
        try {
          const res = await fetch(cloudUrl, { method: "POST", body: data });
          const result = await res.json();
          if (result.url) {
            setFile(result.url.toString());
            toast.success("Photo uploaded");
          } else {
            toast.error("Cloudinary upload failed");
          }
        } catch (error) {
          toast.error("Upload error");
        }
        setLoading(false);
      } else {
        // No Cloudinary config — convert to base64 for local use
        const reader = new FileReader();
        reader.onloadend = () => {
          setFile(reader.result);
          toast.success("Photo selected");
        };
        reader.onerror = () => toast.error("Could not read file");
        reader.readAsDataURL(element);
      }
    } else {
      toast.error("Please select a jpeg or png image");
    }
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();

      if (loading) return;
      // Profile photo is now optional - removed required validation
      const { firstname, lastname, email, password, confpassword } =
        formDetails;
      if (
        !firstname ||
        !lastname ||
        !email ||
        !password ||
        !confpassword ||
        !selectedRole
      ) {
        return toast.error("Input field should not be empty");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }

      await toast.promise(
        axios.post("/user/register", {
          firstname,
          lastname,
          email,
          password,
          pic: file,
          role: selectedRole,
        }),
        {
          pending: "Registering user...",
          success: "User registered successfully",
          error: "Unable to register user",
          loading: "Registering user...",
        },
      );
      return navigate("/login");
    } catch (error) {}
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign Up</h2>
          <form onSubmit={formSubmit} className="register-form">
            <div className="form-row">
              <input
                type="text"
                name="firstname"
                className="form-input"
                placeholder="First name"
                value={formDetails.firstname}
                onChange={inputChange}
              />
              <input
                type="text"
                name="lastname"
                className="form-input"
                placeholder="Last name"
                value={formDetails.lastname}
                onChange={inputChange}
              />
            </div>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
            />
            <input
              type="file"
              onChange={(e) => onUpload(e.target.files[0])}
              name="profile-pic"
              id="profile-pic"
              className="form-input"
            />
            <div className="form-row">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formDetails.password}
                onChange={inputChange}
              />
              <input
                type="password"
                name="confpassword"
                className="form-input"
                placeholder="Confirm password"
                value={formDetails.confpassword}
                onChange={inputChange}
              />
            </div>
            <select
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-input"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Patient">Patient</option>
            </select>

            <button
              type="submit"
              className="btn form-btn"
              disabled={loading ? true : false}
            >
              sign up
            </button>
          </form>
          <p>
            Already a user?{" "}
            <NavLink className="login-link" to={"/login"}>
              Log in
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
