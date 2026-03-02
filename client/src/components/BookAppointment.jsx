import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    age: "",
    bloodGroup: "",
    gender: "",
    number: "",
    familyDiseases: "",
    // prescription:"",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post(
          "/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            age: formDetails.age,
            bloodGroup: formDetails.bloodGroup,
            gender: formDetails.gender,
            number: formDetails.number,
            familyDiseases: formDetails.familyDiseases,
            // prescription: formDetails.prescription,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        ),
        {
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment...",
        },
      );
      setModalOpen(false);
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div className="modal flex-center">
        <div className="modal__content">
          <h2 className="page-heading">Book Appointment</h2>
          <IoMdClose
            onClick={() => setModalOpen(false)}
            className="close-btn"
          />
          <div className="register-container flex-center">
            <form className="register-form">
              {/* Date + Time side by side */}
              <div className="form-row">
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formDetails.date}
                  onChange={inputChange}
                />
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={formDetails.time}
                  onChange={inputChange}
                />
              </div>

              {/* Age + Blood Group side by side */}
              <div className="form-row">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="form-input"
                  value={formDetails.age}
                  onChange={inputChange}
                  required
                />
                <input
                  type="text"
                  name="bloodGroup"
                  placeholder="Blood Group (Optional)"
                  className="form-input"
                  value={formDetails.bloodGroup}
                  onChange={inputChange}
                />
              </div>

              {/* Gender + Mobile side by side */}
              <div className="form-row">
                <select
                  name="gender"
                  className="form-input"
                  value={formDetails.gender}
                  onChange={inputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="number"
                  name="number"
                  placeholder="Mobile Number"
                  className="form-input"
                  value={formDetails.number}
                  onChange={inputChange}
                  required
                />
              </div>

              {/* Family Diseases full width */}
              <textarea
                name="familyDiseases"
                placeholder="Family Diseases (if any)"
                className="form-input"
                value={formDetails.familyDiseases}
                onChange={inputChange}
              ></textarea>

              <button
                type="submit"
                className="btn form-btn"
                onClick={bookAppointment}
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
