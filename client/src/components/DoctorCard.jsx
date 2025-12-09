import React, { useState } from "react";
import BookAppointment from "../components/BookAppointment";
import { toast } from "react-hot-toast";
import { FaUserMd } from "react-icons/fa";

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [token] = useState(localStorage.getItem("token") || "");

  const handleModal = () => {
    if (token === "") {
      return toast.error("You must log in first");
    }
    setModalOpen(true);
  };

  return (
    <>
      <div className="doctor-card">
        <div className="doctor-card-header">
          <div className="doctor-avatar">
            {ele?.userId?.pic ? (
              <img
                src={ele?.userId?.pic}
                alt={ele?.userId?.firstname}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <FaUserMd style={{ color: "#0066ff" }} />
            )}
          </div>
        </div>

        <div className="doctor-card-body">
          <h3 className="doctor-name">
            Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
          </h3>

          <p className="doctor-specialization">{ele?.specialization}</p>

          <div className="doctor-info">
            <p>
              <strong>Experience:</strong> {ele?.experience} years
            </p>
            <p>
              <strong>Consultation Fee:</strong> ₹{ele?.fees}
            </p>
            {ele?.userId?.mobile && (
              <p>
                <strong>Phone:</strong> {ele?.userId?.mobile}
              </p>
            )}
          </div>
        </div>

        <div className="doctor-card-footer">
          <button className="btn-book" onClick={handleModal}>
            Book Appointment
          </button>
        </div>
      </div>

      {modalOpen && <BookAppointment setModalOpen={setModalOpen} ele={ele} />}
    </>
  );
};

export default DoctorCard;
