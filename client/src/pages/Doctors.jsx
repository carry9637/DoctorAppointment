import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Empty from "../components/Empty";
import { FaStethoscope, FaSearch } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchAllDocs = async () => {
    dispatch(setLoading(true));
    const data = await fetchData(`/doctor/getalldoctors`);
    setDoctors(data);
    setFilteredDoctors(data);
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchAllDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = doctors.filter(
      (doctor) =>
        doctor.specialization?.toLowerCase().includes(value.toLowerCase()) ||
        doctor.userId?.firstname?.toLowerCase().includes(value.toLowerCase()) ||
        doctor.userId?.lastname?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="doctors-page">
          <div className="doctors-header">
            <div className="doctors-header-content">
              <div className="header-icon">
                <FaStethoscope />
              </div>
              <div>
                <h1>Find Our Doctors</h1>
                <p>Choose from our team of expert medical professionals</p>
              </div>
            </div>
          </div>

          <div className="doctors-container">
            <div className="search-section">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by specialization or doctor name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {filteredDoctors.length > 0 ? (
              <div className="doctors-grid">
                {filteredDoctors.map((ele) => {
                  return <DoctorCard ele={ele} key={ele._id} />;
                })}
              </div>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Doctors;
