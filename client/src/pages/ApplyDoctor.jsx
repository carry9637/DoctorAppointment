import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoctorSidebar from "../components/DoctorSidebar";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaStethoscope, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import "../styles/doctor-dashboard.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ApplyDoctor = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
  });
  const [existingApplication, setExistingApplication] = useState(null);

  const getMyApplication = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get("/doctor/getmydoctorprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data) {
        setExistingApplication(response.data);
        setFormDetails({
          specialization: response.data.specialization || "",
          experience: response.data.experience || "",
          fees: response.data.fees || "",
        });
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log("No existing application");
    }
  };

  useEffect(() => {
    getMyApplication();
  }, []);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const btnClick = async (e) => {
    e.preventDefault();

    if (
      !formDetails.specialization ||
      !formDetails.experience ||
      !formDetails.fees
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      dispatch(setLoading(true));

      if (existingApplication) {
        // Update existing
        await axios.put("/doctor/updatedoctorprofile", formDetails, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Doctor profile updated successfully");
      } else {
        // Create new
        await axios.post("/doctor/applyfordoctor", formDetails, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Doctor application sent successfully");
      }

      // Refresh data
      await getMyApplication();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error details:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data ||
        error.message ||
        "Unable to process application";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <>
        <div className="doctor-layout">
          <DoctorSidebar />
          <div className="doctor-main">
            <Loading />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="doctor-layout">
        <DoctorSidebar />

        <div className="doctor-main">
          <div className="doctor-header">
            <div className="header-title">
              <FaStethoscope /> Apply for Doctor
            </div>
          </div>

          <div className="doctor-content">
            <div className="data-section">
              <div
                className="section-header"
                style={{
                  borderBottom: "2px solid var(--border-color)",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <FaClipboardList
                    style={{ color: "var(--primary)", fontSize: "1.8rem" }}
                  />
                  <div>
                    <div className="section-title">Application Details</div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-light)",
                        marginTop: "5px",
                      }}
                    >
                      Fill or update your medical credentials
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={btnClick} className="form-group">
                <div className="filter-group">
                  <label>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g., Cardiology, Dermatology"
                    value={formDetails.specialization}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label>Years of Experience *</label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="e.g., 5"
                    min="0"
                    max="60"
                    value={formDetails.experience}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label>Consultation Fees (₹) *</label>
                  <input
                    type="number"
                    name="fees"
                    placeholder="e.g., 500"
                    min="0"
                    value={formDetails.fees}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <FaClipboardList />{" "}
                    {existingApplication
                      ? "Update Application"
                      : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      flex: 1,
                      background: "var(--border-color)",
                      color: "var(--text-dark)",
                    }}
                    onClick={() =>
                      setFormDetails({
                        specialization: "",
                        experience: "",
                        fees: "",
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
      </div>
    </>
  );
};

export default ApplyDoctor;
